using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Customers.Services;
using System;
using System.Data.SqlClient;
using Insite.Core.Interfaces.Plugins.Security;

namespace Extensions.WebApi.Base
{
    public class BaseRepository
    {
        protected IUnitOfWorkFactory UnitOfWorkFactory { get; set; }
        protected readonly ICustomerService CustomerService;
        protected readonly IProductService ProductService;
        protected readonly IAuthenticationService AuthenticationService;

        protected BaseRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
        {
            UnitOfWorkFactory = unitOfWorkFactory;
            CustomerService = customerService;
            ProductService = productService;
            AuthenticationService = authenticationService;
        }

        protected SqlParameter GetParameter(string parameterName, object value)
        {
            object parameterValue = value ?? DBNull.Value;
            return new SqlParameter(parameterName, parameterValue);
        }

        protected DateTime? GetNullableDateTime(SqlDataReader rdr, string key)
        {
            return (rdr[key] != DBNull.Value) ? (DateTime?)rdr[key] : null;
        }
    }
}
