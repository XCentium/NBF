
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLOrderHistoryLine_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLOrderHistoryLine_FromOEG
GO

create procedure ETLOrderHistoryLine_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;


	insert into OrderHistoryLine
	(
		OrderHistoryId,
		[CustomerNumber],
		[LineNumber],
		[ProductERPNumber],
		[Description],
		[QtyOrdered],
		[UnitOfMeasure],
		[InventoryQtyOrdered],
		[UnitRegularPrice],
		[UnitListPrice],
		[UnitDiscountAmount],
		[UnitNetPrice],
		[TotalRegularPrice],
		[TotalDiscountAmount],
		[TotalNetPrice],
		[RMAQtyRequested],
		[RMAQtyReceived],
		CreatedBy,
		ModifiedBy
	) 
	select 
		distinct 
		oh.Id OrderHistoryId,
		oh.[CustomerNumber],
		shd.vd_OID [LineNumber],
		vd_ItemNum + '_' + vd_OptionNum [ProductERPNumber],
		vd_ItemDescr + ' ' + vd_OptionDescr [Description],
		vd_Qty [QtyOrdered],
		'EA' [UnitOfMeasure],
		vd_Qty [InventoryQtyOrdered],
		vd_Price [UnitRegularPrice],
		vd_Price [UnitListPrice],
		vd_Price-vd_ActualPrice [UnitDiscountAmount],
		vd_ActualPrice [UnitNetPrice],
		vd_Qty * (vd_Price) [TotalRegularPrice],
		vd_Qty * (vd_Price-vd_ActualPrice) [TotalDiscountAmount],
		vd_Qty * (vd_ActualPrice) [TotalNetPrice],
		0,0,
		'etl', 'etl'
	from
		OEGSystemStaging.dbo.HistoryVendorDetail shd 
		join OEGSystemStaging.dbo.HistoryOrder sho on sho.ord_Number = shd.vd_OrderNum
		join OrderHistory oh on oh.ERPOrderNumber = sho.ord_Number
	where 
		not exists (select Id from OrderHistoryLine where OrderHistoryId = oh.Id and LineNumber = shd.vd_OID) 
		--and shd.vd_OrderNum = 'ZJ995172'




/*
exec ETLOrderHistoryLine_FromOEG


*/

end


