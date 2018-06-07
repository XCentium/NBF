
using Insite.Data.Entities;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Integration.WebService.Interfaces;

namespace Insite.Integration.WebService.PlugIns.Preprocessor
{
    [DependencyName("VendorOrderLines")]
    public class JobPreprocessorVendorOrderLines : IJobPreprocessor, IDependency, IExtension
    {
        public IntegrationJob IntegrationJob { get; set; }

        public IJobLogger JobLogger { get; set; }

        private IUnitOfWork unitOfWork;

        public JobPreprocessorVendorOrderLines(IUnitOfWorkFactory unitOfWorkFactory)
        {
            unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public virtual IntegrationJob Execute()
        {
            return IntegrationJob;
        }
    }
}