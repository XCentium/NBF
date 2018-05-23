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

namespace NBF.IntegrationProcessor
{
    public class IntegrationProcessorNBFPriceMatrix : IntegrationProcessorPricingRefreshBase
    {
        protected IIntegrationJobLogger JobLogger;
        public override DataSet Execute(SiteConnection siteConnection, IntegrationJob integrationJob, JobDefinitionStep jobStep)
        {
            var initialDataset = XmlDatasetManager.ConvertXmlToDataset(integrationJob.InitialData);
            var dataTable = this.BuildPriceMatrixDataTable(jobStep.Sequence);

            var connStr = jobStep.JobDefinition.IntegrationConnection.ConnectionString;
            string debugString = string.Empty;

            this.JobLogger = (IIntegrationJobLogger)new IntegrationJobLogger(siteConnection, integrationJob);

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("select * from vwPriceMatrix", conn))
                {
                    var drPriceMatrixSource = cmd.ExecuteReader();
                    while (drPriceMatrixSource.Read())
                    {
                        var dataRow = dataTable.NewRow();
                        dataRow[Data.RecordTypeColumn] = drPriceMatrixSource[Data.RecordTypeColumn];
                        dataRow[Data.CurrencyCodeColumn] = drPriceMatrixSource[Data.CurrencyCodeColumn];
                        dataRow[Data.WarehouseColumn] = drPriceMatrixSource[Data.WarehouseColumn];
                        dataRow[Data.UnitOfMeasureColumn] = drPriceMatrixSource[Data.UnitOfMeasureColumn];
                        dataRow[Data.CustomerKeyPartColumn] = drPriceMatrixSource[Data.CustomerKeyPartColumn];
                        dataRow[Data.ProductKeyPartColumn] = this.GetProductId(drPriceMatrixSource["ProductERPNumber"].ToString(), initialDataset);


                        dataRow[Data.ActivateOnColumn] = drPriceMatrixSource[Data.ActivateOnColumn];
                        dataRow[Data.DeactivateOnColumn] = drPriceMatrixSource[Data.DeactivateOnColumn];
                        dataRow[Data.CalculationFlagsColumn] = drPriceMatrixSource[Data.CalculationFlagsColumn];

                        dataRow[Data.PriceBasis01Column] = drPriceMatrixSource[Data.PriceBasis01Column];
                        dataRow[Data.PriceBasis02Column] = drPriceMatrixSource[Data.PriceBasis02Column];
                        dataRow[Data.PriceBasis03Column] = drPriceMatrixSource[Data.PriceBasis03Column];
                        dataRow[Data.PriceBasis04Column] = drPriceMatrixSource[Data.PriceBasis04Column];
                        dataRow[Data.PriceBasis05Column] = drPriceMatrixSource[Data.PriceBasis05Column];
                        dataRow[Data.PriceBasis06Column] = drPriceMatrixSource[Data.PriceBasis06Column];
                        dataRow[Data.PriceBasis07Column] = drPriceMatrixSource[Data.PriceBasis07Column];
                        dataRow[Data.PriceBasis08Column] = drPriceMatrixSource[Data.PriceBasis08Column];
                        dataRow[Data.PriceBasis09Column] = drPriceMatrixSource[Data.PriceBasis09Column];
                        dataRow[Data.PriceBasis10Column] = drPriceMatrixSource[Data.PriceBasis10Column];
                        dataRow[Data.PriceBasis11Column] = drPriceMatrixSource[Data.PriceBasis11Column];

                        dataRow[Data.AdjustmentType01Column] = drPriceMatrixSource[Data.AdjustmentType01Column];
                        dataRow[Data.AdjustmentType02Column] = drPriceMatrixSource[Data.AdjustmentType02Column];
                        dataRow[Data.AdjustmentType03Column] = drPriceMatrixSource[Data.AdjustmentType03Column];
                        dataRow[Data.AdjustmentType04Column] = drPriceMatrixSource[Data.AdjustmentType04Column];
                        dataRow[Data.AdjustmentType05Column] = drPriceMatrixSource[Data.AdjustmentType05Column];
                        dataRow[Data.AdjustmentType06Column] = drPriceMatrixSource[Data.AdjustmentType06Column];
                        dataRow[Data.AdjustmentType07Column] = drPriceMatrixSource[Data.AdjustmentType07Column];
                        dataRow[Data.AdjustmentType08Column] = drPriceMatrixSource[Data.AdjustmentType08Column];
                        dataRow[Data.AdjustmentType09Column] = drPriceMatrixSource[Data.AdjustmentType09Column];
                        dataRow[Data.AdjustmentType10Column] = drPriceMatrixSource[Data.AdjustmentType10Column];
                        dataRow[Data.AdjustmentType11Column] = drPriceMatrixSource[Data.AdjustmentType11Column];

                        dataRow[Data.BreakQty01Column] = drPriceMatrixSource[Data.BreakQty01Column];
                        dataRow[Data.BreakQty02Column] = drPriceMatrixSource[Data.BreakQty02Column];
                        dataRow[Data.BreakQty03Column] = drPriceMatrixSource[Data.BreakQty03Column];
                        dataRow[Data.BreakQty04Column] = drPriceMatrixSource[Data.BreakQty04Column];
                        dataRow[Data.BreakQty05Column] = drPriceMatrixSource[Data.BreakQty05Column];
                        dataRow[Data.BreakQty06Column] = drPriceMatrixSource[Data.BreakQty06Column];
                        dataRow[Data.BreakQty07Column] = drPriceMatrixSource[Data.BreakQty07Column];
                        dataRow[Data.BreakQty08Column] = drPriceMatrixSource[Data.BreakQty08Column];
                        dataRow[Data.BreakQty09Column] = drPriceMatrixSource[Data.BreakQty09Column];
                        dataRow[Data.BreakQty10Column] = drPriceMatrixSource[Data.BreakQty10Column];
                        dataRow[Data.BreakQty11Column] = drPriceMatrixSource[Data.BreakQty11Column];

                        dataRow[Data.Amount01Column] = drPriceMatrixSource[Data.Amount01Column];
                        dataRow[Data.Amount02Column] = drPriceMatrixSource[Data.Amount02Column];
                        dataRow[Data.Amount03Column] = drPriceMatrixSource[Data.Amount03Column];
                        dataRow[Data.Amount04Column] = drPriceMatrixSource[Data.Amount04Column];
                        dataRow[Data.Amount05Column] = drPriceMatrixSource[Data.Amount05Column];
                        dataRow[Data.Amount06Column] = drPriceMatrixSource[Data.Amount06Column];
                        dataRow[Data.Amount07Column] = drPriceMatrixSource[Data.Amount07Column];
                        dataRow[Data.Amount08Column] = drPriceMatrixSource[Data.Amount08Column];
                        dataRow[Data.Amount09Column] = drPriceMatrixSource[Data.Amount09Column];
                        dataRow[Data.Amount10Column] = drPriceMatrixSource[Data.Amount10Column];
                        dataRow[Data.Amount11Column] = drPriceMatrixSource[Data.Amount11Column];

                        dataRow[Data.AltAmount01Column] = drPriceMatrixSource[Data.AltAmount01Column];
                        dataRow[Data.AltAmount02Column] = drPriceMatrixSource[Data.AltAmount02Column];
                        dataRow[Data.AltAmount03Column] = drPriceMatrixSource[Data.AltAmount03Column];
                        dataRow[Data.AltAmount04Column] = drPriceMatrixSource[Data.AltAmount04Column];
                        dataRow[Data.AltAmount05Column] = drPriceMatrixSource[Data.AltAmount05Column];
                        dataRow[Data.AltAmount06Column] = drPriceMatrixSource[Data.AltAmount06Column];
                        dataRow[Data.AltAmount07Column] = drPriceMatrixSource[Data.AltAmount07Column];
                        dataRow[Data.AltAmount08Column] = drPriceMatrixSource[Data.AltAmount08Column];
                        dataRow[Data.AltAmount09Column] = drPriceMatrixSource[Data.AltAmount09Column];
                        dataRow[Data.AltAmount10Column] = drPriceMatrixSource[Data.AltAmount10Column];
                        dataRow[Data.AltAmount11Column] = drPriceMatrixSource[Data.AltAmount11Column];

                        dataTable.Rows.Add(dataRow);
                    }


                }
            }


            debugString = "done";

            JobLogger.Info("Finished Processing Price Matrix dataset.", true);



            var dataSet = new DataSet();
            dataSet.Tables.Add(dataTable);

            return dataSet;
        }
    }
}
