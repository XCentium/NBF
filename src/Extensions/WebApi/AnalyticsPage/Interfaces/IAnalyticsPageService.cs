using Extensions.WebApi.AnalyticsPages.Models;
using Insite.Core.Interfaces.Dependency;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Extensions.WebApi.AnalyticsPage.Interfaces
{
    public interface IAnalyticsPageService : IExtension, IDependency
    {
        Task<IEnumerable<AnalyticsPageDto>> GetAnalyticsPages();
    }
}
