IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwInvoiceHistory') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwInvoiceHistory
GO


CREATE VIEW [dbo].[vwInvoiceHistory]
AS


SELECT 
	  InvoiceNumber,
      convert(nvarchar(10), InvoiceDate, 101) InvoiceDate,
      convert(nvarchar(10), DueDate, 101) DueDate,
      CustomerNumber,
      CustomerPO,
      Terms,
      ShipCode,
      Salesperson,
      BTCompanyName,
      BTAddress1,
      BTAddress2,
      BTCity,
      BTState,
      BTPostalCode,
      STCompanyName,
      STAddress1,
      STAddress2,
      STCity,
      STState,
      STPostalCode,
      ProductTotal,
      ShippingAndHandling,
      TaxAmount,
      OrderBalance,
      OrderTotal,
      WebCustomerNumber,
      OrderNumber,
      VendorCode

FROM
	OEGSystemStaging.dbo.HistoryInvoice

/*
select * from vwInvoiceHistory 
*/

GO