using Insite.Account.Services.Parameters;
using Insite.Account.Services.Pipelines;
using Insite.Account.Services.Pipelines.Parameters;
using Insite.Account.Services.Pipelines.Results;
using Insite.Account.Services.Results;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Customers.Services;
using Insite.Customers.Services.Parameters;
using Insite.Customers.Services.Results;
using Insite.Data.Entities;
using Insite.Data.Entities.Dtos;
using System;

namespace Extensions.Handlers
{
    [DependencyName("NBFAddCustomer")]
    public sealed class NBFAddCustomer : HandlerBase<AddAccountParameter, AddAccountResult>
    {
        private readonly Lazy<ICustomerService> customerService;
        private readonly IAccountPipeline accountPipeline;

        public NBFAddCustomer(IAccountPipeline accountPipeline, Lazy<ICustomerService> customerService)
        {
            this.accountPipeline = accountPipeline;
            this.customerService = customerService;
        }

        public override int Order
        {
            get
            {
                return 1310;
            }
        }

        public override AddAccountResult Execute(IUnitOfWork unitOfWork, AddAccountParameter parameter, AddAccountResult result)
        {
            UserProfile userProfile = result.UserProfile;
            Customer billTo;
            if (result.IsUserAdministration)
            {
                billTo = SiteContext.Current.BillTo;
            }
            else
            {
                ICustomerService customerService = this.customerService.Value;
                AddBillToParameter parameter1 = new AddBillToParameter();
                parameter1.Email = parameter.IsGuest ? string.Empty : parameter.Email;
                int num = parameter.IsGuest ? 1 : 0;
                parameter1.IsGuest = num != 0;
                AddBillToResult addBillToResult = customerService.AddBillTo(parameter1);
                if (addBillToResult.ResultCode != ResultCode.Success)
                    return this.CreateErrorServiceResult<AddAccountResult>(result, addBillToResult.SubCode, addBillToResult.Message);
                billTo = addBillToResult.BillTo;
                CurrencyDto currencyDto = SiteContext.Current.CurrencyDto;
                if (currencyDto != null)
                {
                    Guid id = currencyDto.Id;
                    Guid? currencyId = billTo.CurrencyId;
                    if ((currencyId.HasValue ? (id != currencyId.GetValueOrDefault() ? 1 : 0) : 1) != 0)
                    {
                        billTo.Currency = unitOfWork.GetRepository<Insite.Data.Entities.Currency>().Get(currencyDto.Id);
                        Customer customer1 = billTo;
                        Insite.Data.Entities.Currency currency1 = customer1.Currency;
                        Guid? nullable = currency1 != null ? new Guid?(currency1.Id) : new Guid?();
                        customer1.CurrencyId = nullable;
                        Customer customer2 = billTo;
                        Insite.Data.Entities.Currency currency2 = customer2.Currency;
                        string str = (currency2 != null ? currency2.CurrencyCode : (string)null) ?? string.Empty;
                        customer2.CurrencyCode = str;
                    }
                }
            }
            AssignCustomerResult assignCustomerResult = this.accountPipeline.AssignCustomer(new AssignCustomerParameter(userProfile, billTo));
            if (assignCustomerResult.ResultCode != ResultCode.Success)
                return this.CreateErrorServiceResult<AddAccountResult>(result, assignCustomerResult.SubCode, assignCustomerResult.Message);
            result.BillTo = billTo;
            result.ShipTo = billTo;
            if (SiteContext.Current.WebsiteDto.IsRestricted)
                billTo.Websites.Add(unitOfWork.GetRepository<Website>().Get(SiteContext.Current.WebsiteDto.Id));
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
