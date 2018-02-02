using System.Collections.Generic;
using System.Data;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Catalog.Services.Dtos;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using System.Dynamic;

namespace Extensions.Handlers.Interfaces
{
    public interface INbfListrakHelper : IDependency, IExtension
    {
        bool SendTransactionalEmail(ExpandoObject templateData, SendEmailParameter sendEmailParameter, IUnitOfWork unitOfWork);
    }
}
