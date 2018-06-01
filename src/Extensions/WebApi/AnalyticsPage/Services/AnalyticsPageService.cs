using Insite.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Interfaces.Data;
using Extensions.WebApi.AnalyticsPage.Interfaces;
using System.Threading.Tasks;
using System.Collections;
using Extensions.WebApi.AnalyticsPages.Models;

namespace Extensions.WebApi.AnalyticsPage.Services
{
    public class AnalyticsPageService : ServiceBase, IAnalyticsPageService
    {
        private readonly IAnalyticsPageRepository analyticsPageRepo;
        public AnalyticsPageService(IUnitOfWorkFactory unitOfWorkFactory, IAnalyticsPageRepository apRepo) : base(unitOfWorkFactory)
        {
            analyticsPageRepo = apRepo;
        }

        [Transaction]
        public Task<IEnumerable<AnalyticsPageDto>> GetAnalyticsPages()
        {
            return Task.FromResult(analyticsPageRepo.GetAnalyticsPages());
        }
    }
}