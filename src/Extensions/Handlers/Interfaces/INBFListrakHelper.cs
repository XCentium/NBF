using System.Collections.Generic;
using System.Data;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Catalog.Services.Dtos;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using System.Dynamic;
using System.Threading.Tasks;
using Extensions.WebApi.Listrak.Models;

namespace Extensions.Handlers.Interfaces
{
    public interface INbfListrakHelper : IDependency, IExtension
    {
        Task<bool> SendTransactionalEmail(SendTransationalMessageParameter parameter);
    }
}
