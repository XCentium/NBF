using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Customers.Services;
using System;
using System.Configuration;
using System.Data.SqlClient;
using Insite.Core.Interfaces.Providers;
using Insite.Core.Interfaces.Plugins.Security;

namespace NBF.Customizations.Lib.Api.Base
{
    public class BaseRepository
    {
        private readonly string _connectionString;
        protected IUnitOfWorkFactory UnitOfWorkFactory { get; set; }
        protected readonly ICustomerService CustomerService;
        protected readonly IProductService ProductService;
        protected readonly IAuthenticationService AuthenticationService;

        protected BaseRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
        {
            _connectionString = ConfigurationManager.ConnectionStrings["InSite.Commerce"].ConnectionString;
            UnitOfWorkFactory = unitOfWorkFactory;
            CustomerService = customerService;
            ProductService = productService;
            AuthenticationService = authenticationService;
        }

        protected SqlConnection GetOpenConnection()
        {
            var result = new SqlConnection(_connectionString);
            result.Open();
            return result;
        }

        protected SqlConnection GetNamedConnection(string name)
        {
            var connectionString = ConfigurationManager.ConnectionStrings[name].ConnectionString;
            var result = new SqlConnection(connectionString);
            result.Open();
            return result;
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
