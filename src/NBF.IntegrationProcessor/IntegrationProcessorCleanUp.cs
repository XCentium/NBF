using Insite.WIS.Broker.Interfaces;
using System;
using System.Linq;
using Insite.WIS.Broker;
using Insite.WIS.Broker.WebIntegrationService;
using System.Data;
using Insite.WIS.Broker.Plugins;
using Insite.Common.Helpers;
using Insite.WIS.Broker.Plugins.Constants;
using System.Data.SqlClient;
using Insite.Data.Entities;
using Insite.Data;
using Insite.Core.Interfaces.Data;

namespace NBF.IntegrationProcessor
{
    public class IntegrationProcessorCleanUp : IIntegrationProcessor
    {

        protected IIntegrationJobLogger JobLogger;
        protected IUnitOfWork UnitOfWork;
        public IntegrationProcessorCleanUp(IUnitOfWork unitOfWork)
        {
            this.UnitOfWork = unitOfWork;
        }

        public DataSet Execute(SiteConnection siteConnection, Insite.WIS.Broker.WebIntegrationService.IntegrationJob integrationJob, Insite.WIS.Broker.WebIntegrationService.JobDefinitionStep jobStep)
        {

     

        var connStr = jobStep.JobDefinition.IntegrationConnection.ConnectionString;
            string debugString = string.Empty;
           
            this.JobLogger = (IIntegrationJobLogger)new IntegrationJobLogger(siteConnection, integrationJob);

            var initialDataset = XmlDatasetManager.ConvertXmlToDataset(integrationJob.InitialData);

            var productRepository = this.UnitOfWork.GetRepository<Product>();

            debugString = "done";

            JobLogger.Info("Finished Processing CleanUp.", true);



            return initialDataset;
        }
    }
}
