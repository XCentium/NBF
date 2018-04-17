
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLOrderTracking_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLOrderTracking_FromOEG
GO

create procedure ETLOrderTracking_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;


	-- Carrier

	insert into Carrier ([Name], [Enable]) 
	select distinct vsh_ActlCarrier,1 from OEGSystemStaging.dbo.HistoryOrderTracking 
	where not exists (select Id from Carrier where [Name] = vsh_ActlCarrier)

	-- Shipment

	insert into Shipment
		(
		ShipmentNumber,
		ShipmentDate,
		ERPOrderNumber
		)
	select
		distinct 
		shot.vsh_OrderNum + ' ' + shot.vsh_VendorCode + ' ' + FORMAT( shot.vsh_PickupDate, 'yyyy-dd-MM', 'en-US' ),
		shot.vsh_PickupDate,
		shot.vsh_OrderNum
	from
		 OEGSystemStaging.dbo.HistoryOrderTracking shot 
	where
		not exists (
					select Id from Shipment 
					where ERPOrderNumber = shot.vsh_OrderNum
					and ShipmentNumber = shot.vsh_OrderNum + ' ' + shot.vsh_VendorCode + ' ' + FORMAT( shot.vsh_PickupDate, 'yyyy-dd-MM', 'en-US' )
					)
		and shot.vsh_VendorCode is not null
		and	shot.[vsh_PickupDate] is not null
		and shot.vsh_ProNumber is not null
		and shot.vsh_ActlCarrier is not null
		and shot.vsh_Url is not null

	-- ShipmentPackage

	insert into ShipmentPackage
		(
		[ShipmentId],
		[Carrier],
		[TrackingNumber],
		[PackageNumber]
		)
	select
		distinct
		s.Id,
		shot.vsh_ActlCarrier,
		shot.vsh_ProNumber [TrackingNumber],
		shot.vsh_ProNumber+shot.vsh_ActlCarrier [PackageNumber]
	from
		 OEGSystemStaging.dbo.HistoryOrderTracking shot 
		 join Shipment s on s.ShipmentNumber = shot.vsh_OrderNum + ' ' + shot.vsh_VendorCode + ' ' + FORMAT( shot.vsh_PickupDate, 'yyyy-dd-MM', 'en-US' )
	where
		not exists (
					select Id from ShipmentPackage 
					where [PackageNumber] = shot.vsh_ProNumber+shot.vsh_ActlCarrier
					and ShipmentId = s.Id
					)
		and shot.vsh_VendorCode is not null
		and	shot.[vsh_PickupDate] is not null
		and shot.vsh_ProNumber is not null
		and shot.vsh_ActlCarrier is not null
		and shot.vsh_Url is not null


/*
exec ETLOrderTracking_FromOEG

select * from OEGSystemStaging.dbo.HistoryOrderTracking where vsh_ProNumber = '1Z8W17X003422575929'

select * from Shipment
select * from ShipmentPackage 

delete from Shipment
delete from ShipmentPackage


*/

end


