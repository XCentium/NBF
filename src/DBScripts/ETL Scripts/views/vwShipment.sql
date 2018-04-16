IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwShipment') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwShipment
GO


CREATE VIEW [dbo].[vwShipment]
AS


	SELECT 
		s.ShipmentNumber,
		convert(nvarchar(10), s.ShipmentDate, 101) ShipmentDate,
		ERPOrderNumber

	FROM
		Shipment s

/*
select * from vwShipment 
*/

GO