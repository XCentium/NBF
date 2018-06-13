
using Insite.Data.Entities;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Integration.WebService.Interfaces;
using Insite.Cart.Services.Pipelines;
using Insite.Common.Helpers;
using Extensions.Models.ShippingByVendor;
using System;
using System.Linq;
using System.Collections;

namespace Extensions.Plugins.Integration
{
    [DependencyName("NbfOrderSubmit")]
    public class JobPreprocessorNbfOrderSubmit : JobPreprocessorGenericSubmit
    {

        public JobPreprocessorNbfOrderSubmit(IUnitOfWorkFactory unitOfWorkFactory, ICartPipeline cartPipeline) : base(unitOfWorkFactory, cartPipeline)
        {}

        public override IntegrationJob Execute()
        {
            base.Execute();

            var dataset = XmlDatasetManager.ConvertXmlToDataset(IntegrationJob.InitialData);
            string orderNumber;
            try
            {
                orderNumber = dataset.Tables["CustomerOrder"].Rows[0]["OrderNumber"].ToString();
            }
            catch (Exception e)
            {
                throw new Exception("Error fetching OrderNumber. See inner exception for more details.", e);
            }

            IList sbvLines;
            try
            {
                sbvLines = UnitOfWork.GetRepository<ShippingByVendorModel>().GetTable().Where(sbv => sbv.OrderNumber == orderNumber).ToList() ;
            }catch(Exception e)
            {
                throw new Exception("Error fetching ShippingByVendor records for order. See inner exception for more details.", e);
            }

            dataset.Tables.Add(ObjectHelper.GetDataTableFromList(sbvLines, typeof(ShippingByVendorModel)));

            IntegrationJob.InitialData = XmlDatasetManager.ConvertDatasetToXml(dataset);

            return IntegrationJob;
        }
    }
}