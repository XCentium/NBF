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
    public class IntegrationProcessorERPSubmit : IIntegrationProcessor
    {
        protected IIntegrationJobLogger JobLogger;
        public DataSet Execute(SiteConnection siteConnection, IntegrationJob integrationJob, JobDefinitionStep jobStep)
        {
            var connStr = jobStep.JobDefinition.IntegrationConnection.ConnectionString;
            string debugString = string.Empty;

            this.JobLogger = (IIntegrationJobLogger)new IntegrationJobLogger(siteConnection, integrationJob);

            var initialDataset = XmlDatasetManager.ConvertXmlToDataset(integrationJob.InitialData);

            if (
                initialDataset == null
                || !initialDataset.Tables.Contains(Data.CustomerOrderTable)
                || initialDataset.Tables[Data.CustomerOrderTable].Rows.Count == 0
                || !initialDataset.Tables.Contains(Data.OrderLineTable)
                || initialDataset.Tables[Data.OrderLineTable].Rows.Count == 0
                || !initialDataset.Tables.Contains(Data.CustomerTable)
                || initialDataset.Tables[Data.CustomerTable].Rows.Count == 0
                || !initialDataset.Tables.Contains(Data.ProductTable)
                || initialDataset.Tables[Data.ProductTable].Rows.Count == 0
                || !initialDataset.Tables.Contains(Data.ShipToTable)
                || initialDataset.Tables[Data.ShipToTable].Rows.Count == 0
            )
            {
                throw new ArgumentException(Messages.InvalidInitialDataSetExceptionMessage);
            }


            var dtCustomerOrderTable = initialDataset.Tables[Data.CustomerOrderTable];
            var dtOrderLineTable = initialDataset.Tables[Data.OrderLineTable];
            var dtCustomerTable = initialDataset.Tables[Data.CustomerTable];
            var dtProductTable = initialDataset.Tables[Data.ProductTable];
            var dtShipToTable = initialDataset.Tables[Data.ShipToTable];



            foreach (DataRow dr in dtCustomerTable.Rows)
            {
                debugString = "Customer：" + dr[Data.CustomerNumberColumn];
                #region create customer record
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("ETLSync_Customer", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier)).Value = new Guid(dr["Id"].ToString());
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerNumberColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerNumberColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerSequenceColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerSequenceColumn];
                        cmd.ExecuteNonQuery();
                    }
                }
                #endregion
            }

            foreach (DataRow dr in dtShipToTable.Rows)
            {
                debugString = "Customer：" + dr[Data.CustomerNumberColumn];
                #region create customer record
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("ETLSync_Customer", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier)).Value = new Guid(dr["Id"].ToString());
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerNumberColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerNumberColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerSequenceColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerSequenceColumn];
                        cmd.ExecuteNonQuery();
                    }
                }
                #endregion
            }

            foreach (DataRow dr in dtCustomerOrderTable.Rows)
            {
                debugString = "OrderNumber：" + dr[Data.OrderNumberColumn];

                #region create order record
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("ETLSync_CustomerOrder", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier)).Value = new Guid(dr["Id"].ToString());
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerIdColumn, SqlDbType.UniqueIdentifier)).Value = new Guid(dr[Data.CustomerIdColumn].ToString());
                        cmd.Parameters.Add(new SqlParameter("@" + "ShipToId", SqlDbType.UniqueIdentifier)).Value = new Guid(dr["ShipToId"].ToString());
                        cmd.Parameters.Add(new SqlParameter("@" + "Status", SqlDbType.NVarChar)).Value = dr["Status"];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.OrderNumberColumn, SqlDbType.NVarChar)).Value = dr[Data.OrderNumberColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.OrderDateColumn, SqlDbType.DateTimeOffset)).Value = dr[Data.OrderDateColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerPoColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerPoColumn];

                        cmd.Parameters.Add(new SqlParameter("@" + Data.TermsCodeColumn, SqlDbType.NVarChar)).Value = dr[Data.TermsCodeColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.ShipCodeColumn, SqlDbType.NVarChar)).Value = dr[Data.ShipCodeColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.ShippingColumn, SqlDbType.Decimal)).Value = dr[Data.ShippingColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.HandlingColumn, SqlDbType.Decimal)).Value = dr[Data.HandlingColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerNumberColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerNumberColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerSequenceColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerSequenceColumn];

                        cmd.Parameters.Add(new SqlParameter("@" + "BTCompanyName", SqlDbType.NVarChar)).Value = dr["BTCompanyName"];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtFirstNameColumn, SqlDbType.NVarChar)).Value = dr[Data.BtFirstNameColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + "BTMiddleName", SqlDbType.NVarChar)).Value = dr["BTMiddleName"];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtLastNameColumn, SqlDbType.NVarChar)).Value = dr[Data.BtLastNameColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtPhoneColumn, SqlDbType.NVarChar)).Value = dr[Data.BtPhoneColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtAddress1Column, SqlDbType.NVarChar)).Value = dr[Data.BtAddress1Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtAddress2Column, SqlDbType.NVarChar)).Value = dr[Data.BtAddress2Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtAddress3Column, SqlDbType.NVarChar)).Value = dr[Data.BtAddress3Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtAddress4Column, SqlDbType.NVarChar)).Value = dr[Data.BtAddress4Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtCityColumn, SqlDbType.NVarChar)).Value = dr[Data.BtCityColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtStateColumn, SqlDbType.NVarChar)).Value = dr[Data.BtStateColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtPostalCodeColumn, SqlDbType.NVarChar)).Value = dr[Data.BtPostalCodeColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.BtCountryColumn, SqlDbType.NVarChar)).Value = dr[Data.BtCountryColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + "BTEmail", SqlDbType.NVarChar)).Value = dr["BTEmail"];

                        cmd.Parameters.Add(new SqlParameter("@" + "STCompanyName", SqlDbType.NVarChar)).Value = dr["STCompanyName"];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StFirstNameColumn, SqlDbType.NVarChar)).Value = dr[Data.StFirstNameColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + "STMiddleName", SqlDbType.NVarChar)).Value = dr["STMiddleName"];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StLastNameColumn, SqlDbType.NVarChar)).Value = dr[Data.StLastNameColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StPhoneColumn, SqlDbType.NVarChar)).Value = dr[Data.StPhoneColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StAddress1Column, SqlDbType.NVarChar)).Value = dr[Data.StAddress1Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StAddress2Column, SqlDbType.NVarChar)).Value = dr[Data.StAddress2Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StAddress3Column, SqlDbType.NVarChar)).Value = dr[Data.StAddress3Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StAddress4Column, SqlDbType.NVarChar)).Value = dr[Data.StAddress4Column];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StCityColumn, SqlDbType.NVarChar)).Value = dr[Data.StCityColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StStateColumn, SqlDbType.NVarChar)).Value = dr[Data.StStateColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StPostalCodeColumn, SqlDbType.NVarChar)).Value = dr[Data.StPostalCodeColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.StCountryColumn, SqlDbType.NVarChar)).Value = dr[Data.StCountryColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + "STEmail", SqlDbType.NVarChar)).Value = dr["STEmail"];

                        cmd.Parameters.Add(new SqlParameter("@" + Data.ErpOrderNumberColumn, SqlDbType.NVarChar)).Value = dr[Data.ErpOrderNumberColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + Data.RequestedShipDateColumn, SqlDbType.DateTimeOffset)).Value = dr[Data.RequestedShipDateColumn];
                        cmd.Parameters.Add(new SqlParameter("@" + "OtherCharges", SqlDbType.Decimal)).Value = dr["OtherCharges"];
                        cmd.Parameters.Add(new SqlParameter("@" + "TaxAmount", SqlDbType.Decimal)).Value = dr["TaxAmount"];
                        cmd.Parameters.Add(new SqlParameter("@" + "OrderTotal", SqlDbType.Decimal)).Value = dr["OrderTotal"];
                        cmd.Parameters.Add(new SqlParameter("@" + "LastPricingOn", SqlDbType.DateTimeOffset)).Value = dr["LastPricingOn"];


                        cmd.ExecuteNonQuery();
                    }
                }
                #endregion
            }


            // set up some relationships so we can do foreach on the datatables
            initialDataset.Relations.Add("OrderLine2Product", dtOrderLineTable.Columns[Data.ProductIdColumn], dtProductTable.Columns["Id"]);

            foreach (DataRow dr in dtOrderLineTable.Rows)
            {
                debugString = "LineNumber：" + dr[Data.LineColumn];

                var drProducts = dr.GetChildRows(initialDataset.Relations["OrderLine2Product"]);
                if (drProducts != null && drProducts.Count() > 0)
                {
                    debugString = "ProductNumber: " + drProducts[0][Data.ErpNumberColumn];

                    #region create order line record
                    using (SqlConnection conn = new SqlConnection(connStr))
                    {
                        conn.Open();

                        using (SqlCommand cmd = new SqlCommand("ETLSync_OrderLine", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier)).Value = new Guid(dr["Id"].ToString());
                            cmd.Parameters.Add(new SqlParameter("@" + "CustomerOrderId", SqlDbType.UniqueIdentifier)).Value = new Guid(dr["CustomerOrderId"].ToString());
                            cmd.Parameters.Add(new SqlParameter("@" + "ProductERPNumber", SqlDbType.NVarChar)).Value = drProducts[0][Data.ErpNumberColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + "Status", SqlDbType.NVarChar)).Value = dr["Status"];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.LineColumn, SqlDbType.Int)).Value = dr[Data.LineColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + "Release", SqlDbType.Int)).Value = dr["Release"];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.DescriptionColumn, SqlDbType.NVarChar)).Value = dr[Data.DescriptionColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.NotesColumn, SqlDbType.NVarChar)).Value = dr[Data.NotesColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.QtyOrderedColumn, SqlDbType.Decimal)).Value = dr[Data.QtyOrderedColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.UnitRegularPriceColumn, SqlDbType.Decimal)).Value = dr[Data.UnitRegularPriceColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.UnitNetPriceColumn, SqlDbType.Decimal)).Value = dr[Data.UnitNetPriceColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.UnitOfMeasureColumn, SqlDbType.NVarChar)).Value = dr[Data.UnitOfMeasureColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + "QtyShipped", SqlDbType.Decimal)).Value = dr["QtyShipped"];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.DueDateColumn, SqlDbType.DateTimeOffset)).Value = dr[Data.DueDateColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + "PromiseDate", SqlDbType.DateTimeOffset)).Value = dr["PromiseDate"];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.ShipSiteColumn, SqlDbType.NVarChar)).Value = dr[Data.ShipSiteColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + "ShipDate", SqlDbType.DateTimeOffset)).Value = dr["ShipDate"];
                            cmd.Parameters.Add(new SqlParameter("@" + "IsPromotionItem", SqlDbType.Bit)).Value = dr["IsPromotionItem"];
                            cmd.Parameters.Add(new SqlParameter("@" + Data.CustomerPoLineColumn, SqlDbType.NVarChar)).Value = dr[Data.CustomerPoLineColumn];
                            cmd.Parameters.Add(new SqlParameter("@" + "CostCode", SqlDbType.NVarChar)).Value = dr["CostCode"];
                            cmd.Parameters.Add(new SqlParameter("@" + "OrderLineOtherCharges", SqlDbType.Decimal)).Value = dr["OrderLineOtherCharges"];
                            cmd.Parameters.Add(new SqlParameter("@" + "TaxAmount", SqlDbType.Decimal)).Value = dr["TaxAmount"];
                            cmd.Parameters.Add(new SqlParameter("@" + "TotalRegularPrice", SqlDbType.Decimal)).Value = dr["TotalRegularPrice"];
                            cmd.Parameters.Add(new SqlParameter("@" + "UnitListPrice", SqlDbType.Decimal)).Value = dr["UnitListPrice"];
                            cmd.Parameters.Add(new SqlParameter("@" + "UnitCost", SqlDbType.Decimal)).Value = dr["UnitCost"];
                            cmd.Parameters.Add(new SqlParameter("@" + "SmartPart", SqlDbType.NVarChar)).Value = dr["SmartPart"];
                            cmd.Parameters.Add(new SqlParameter("@" + "TotalNetPrice", SqlDbType.Decimal)).Value = dr["TotalNetPrice"];



                            cmd.ExecuteNonQuery();
                        }
                    }
                    #endregion


                }

            }




            debugString = "done";

            JobLogger.Info("Finished Processing Order.", true);



            return initialDataset;
        }
    }
}
