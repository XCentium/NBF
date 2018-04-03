IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwOrderHistory') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwOrderHistory
GO


CREATE VIEW [dbo].[vwOrderHistory]
AS


SELECT 
		oh.Id,
		oh.ERPOrderNumber,
		oh.WebOrderNumber,
		convert(nvarchar(10), oh.OrderDate, 101) OrderDate,
		oh.[Status],
		oh.CustomerNumber,
		oh.CustomerPO,

		oh.BTCompanyName,
		oh.BTAddress1,
		oh.BTAddress2,
		oh.BTCity,
		oh.BTState,
		oh.BTPostalCode,
		oh.BTCountry,

		oh.STCompanyName,
		oh.STAddress1,
		oh.STAddress2,
		oh.STCity,
		oh.STState,
		oh.STPostalCode,
		oh.STCountry,

		oh.ShippingCharges,
		oh.TaxAmount,
		oh.OrderTotal,
		oh.CreatedBy,
		oh.ModifiedBy

FROM
	dbo.OrderHistory oh

/*
select * from vwOrderHistory where WebOrderNumber!=''
*/

GO