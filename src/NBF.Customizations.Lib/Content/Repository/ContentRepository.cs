using System;
using System.Linq;
using Insite.Catalog.Services;
using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Customers.Services;
using NBF.Customizations.Lib.Api.Content.Interfaces;
using NBF.Customizations.Lib.Api.Content.Models;
using NBF.Customizations.Lib.Api.Base;
using System.Collections.Generic;
using Insite.Data.Entities;
using Insite.Data.Extensions;
using Insite.Core.Context;
using Insite.Core.Plugins.Search;
using Insite.Core.Interfaces.Plugins.Security;

namespace NBF.Customizations.Lib.Api.Content.Repository
{
    public class ContentRepository : BaseRepository, IContentRepository, IInterceptable
    {
        private const bool IgnoreCase = true;

        public ContentRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
        }

        public List<string> GetContentTags()
        {

            var result = new List<string>();
            result.Add("test 1");
            result.Add("test 2");
            
            
            return result;
        }
    }
}
