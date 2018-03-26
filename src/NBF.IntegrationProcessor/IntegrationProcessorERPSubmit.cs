﻿using Insite.WIS.Broker.Interfaces;
using System;
using System.Linq;
using Insite.WIS.Broker;
using Insite.WIS.Broker.WebIntegrationService;
using System.Data;
using Insite.WIS.Broker.Plugins;
using Insite.Common.Helpers;
using Insite.WIS.Broker.Plugins.Constants;
using System.Configuration;
using System.Data.SqlClient;

namespace NBF.IntegrationProcessor
{
    public class IntegrationProcessorERPSubmit : IIntegrationProcessor
    {
        protected IIntegrationJobLogger JobLogger;
        public DataSet Execute(SiteConnection siteConnection, IntegrationJob integrationJob, JobDefinitionStep jobStep)
        {
            var mySetting = jobStep.JobDefinition.IntegrationConnection;

            this.JobLogger = (IIntegrationJobLogger)new IntegrationJobLogger(siteConnection, integrationJob);

            var initialDataset = XmlDatasetManager.ConvertXmlToDataset(integrationJob.InitialData);
            
            if (initialDataset == null
            || !initialDataset.Tables.Contains(Data.CustomerOrderTable)
            || initialDataset.Tables[Data.CustomerOrderTable].Rows.Count == 0
            || !initialDataset.Tables.Contains(Data.OrderLineTable)
            || initialDataset.Tables[Data.OrderLineTable].Rows.Count == 0
            || !initialDataset.Tables.Contains(Data.CustomerTable)
            || initialDataset.Tables[Data.CustomerTable].Rows.Count == 0
            || !initialDataset.Tables.Contains(Data.ProductTable)
            || initialDataset.Tables[Data.ProductTable].Rows.Count == 0
            || !initialDataset.Tables.Contains(Data.ShipToTable)
            || initialDataset.Tables[Data.ShipToTable].Rows.Count == 0)
            {
                throw new ArgumentException(Messages.InvalidInitialDataSetExceptionMessage);
            }


            var dtCustomerOrderTable = initialDataset.Tables[Data.CustomerOrderTable];
            var dtOrderLineTable = initialDataset.Tables[Data.OrderLineTable];
            var dtCustomerTable = initialDataset.Tables[Data.CustomerTable];
            var dtShipToTable = initialDataset.Tables[Data.ShipToTable];
            var dtProductTable = initialDataset.Tables[Data.ProductTable];

            /*
                        DataSet ds = new DataSet();
                        ds.Tables.Add(dtCustomerOrderTable);
                        ds.Tables.Add(dtCustomerTable);
                        ds.Relations.Add(dtCustomerOrderTable.Columns[Data.CustomerIdColumn], dtProductTable.Columns[Data.CustomerIdColumn]);
            */

            // set up some relationships so we can do foreach on the datatables

            initialDataset.Relations.Add("Customer2CustomerOrder", dtCustomerTable.Columns["Id"], dtCustomerOrderTable.Columns[Data.CustomerIdColumn]);


            foreach (DataRow item in dtCustomerTable.Rows)
            {
                Console.WriteLine("Customer：" + item[Data.CustomerNumberColumn]);

                foreach (DataRow row in item.GetChildRows(initialDataset.Relations["Customer2CustomerOrder"]))
                {
                    Console.WriteLine("OrderNumber：" + row[Data.OrderNumberColumn]);
                }
                Console.WriteLine();
            }

            /*

            var dataRowCustomerOrder = initialDataset.Tables[Data.CustomerOrderTable].Rows[0];
            var dataRowOrderLines = initialDataset.Tables[Data.OrderLineTable].Rows;
            var dataRowCustomer = initialDataset.Tables[Data.CustomerTable].Rows;
            var dataRowShipToTable = initialDataset.Tables[Data.ShipToTable].Rows[0];
            var productTable = initialDataset.Tables[Data.ProductTable];





            var erpnumber = string.Empty;
            var productId = string.Empty;
            foreach (DataRow orderLine in dataRowOrderLines)
            {
                productId = orderLine[Data.ProductIdColumn].ToString();
                var selectString = String.Format("Id = '{0}'", productId);
                var lineProduct = productTable.Select(selectString).FirstOrDefault();
                if (lineProduct != null)
                {
                    erpnumber = lineProduct[Data.ErpNumberColumn].ToString();
                }
            }


            string customerNumber = dataRowCustomerOrder[Data.CustomerNumberColumn].ToString();
            string orderNumber = dataRowCustomerOrder[Data.OrderNumberColumn].ToString();

            string sqlString = String.Format("INSERT INTO testOrder (OrderNumber, CustomerNumber, Product) VALUES ('{0}','{1}', '{2}')", orderNumber, customerNumber, erpnumber);

            SqlConnection sqlcnn = new SqlConnection(mySetting.ConnectionString);
            SqlCommand cmd = new SqlCommand(sqlString, sqlcnn);
            sqlcnn.Open();
            cmd.ExecuteNonQuery();
            sqlcnn.Close();

        */

            JobLogger.Info("Finished Processing Order.",true);



            return initialDataset;
        }
    }
}
