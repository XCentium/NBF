using System;
using System.Collections.Generic;
using System.Linq;
using Extensions.WebApi.Base;
using Extensions.WebApi.PriceCode.Interfaces;
using Extensions.WebApi.PriceCode.Models;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;
using Insite.Data.Entities;

namespace Extensions.WebApi.PriceCode.Repository
{
    public class PriceCodeRepository : BaseRepository, IPriceCodeRepository
    {
        private readonly IUnitOfWork _unitOfWork;

        public PriceCodeRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public GetPriceCodeResult GetPriceCode(string billToId)
        {
            var priceCode = _unitOfWork.GetRepository<Customer>().GetTable()
                .FirstOrDefault(c => c.Id.ToString().Equals(billToId))?.PriceCode;

            var displayName = _unitOfWork.GetRepository<CustomProperty>().GetTable()
                .FirstOrDefault(cp => cp.ParentId.ToString().Equals(billToId) && cp.Name.Equals("contractTypeDisplayName", StringComparison.CurrentCultureIgnoreCase))?.Value;

            return new GetPriceCodeResult()
            {
                DisplayName = displayName,
                Value = priceCode
            };
        }

        public string SetPriceCode(string priceCode, string value, string billToId)
        {
            try
            {
                var customer = _unitOfWork.GetRepository<Customer>().GetTable()
                    .FirstOrDefault(c => c.Id.ToString().Equals(billToId));

                if (customer == null) return "Failure";

                var cp = customer.CustomProperties?.FirstOrDefault(x =>
                    x.Name.Equals("contractTypeDisplayName", StringComparison.CurrentCultureIgnoreCase));

                if (cp == null)
                {
                    if (customer.CustomProperties == null)
                    {
                        customer.CustomProperties = new List<CustomProperty>();
                    }

                    customer.CustomProperties.Add(new CustomProperty()
                    {
                        ParentTable = "Customer",
                        Name = "contractTypeDisplayName",
                        Value = value
                    });
                }
                else
                {
                    cp.Value = value;
                }

                customer.PriceCode = priceCode;
                _unitOfWork.Save();
                return "Success";
            }
            catch(Exception e) {
                return "Failure";
            }
        }
    }
}