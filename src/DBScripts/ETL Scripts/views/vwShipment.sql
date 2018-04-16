IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwShipment') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwShipment
GO


CREATE VIEW [dbo].[vwShipment]
AS


	SELECT 
		ShipmentNumber,
		ShipmentDate,
		ERPOrderNumber

	FROM
		Shipment

/*
select * from vwShipment 
*/

GO