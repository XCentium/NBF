IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwShipmentPackage') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwShipmentPackage
GO


CREATE VIEW [dbo].[vwShipmentPackage]
AS


	SELECT 
		Carrier,
		TrackingNumber,
		PackageNumber,
		s.ShipmentNumber
	FROM
		ShipmentPackage sp
		join Shipment s on s.Id = sp.ShipmentId

/*
select * from vwShipmentPackage 
*/

GO