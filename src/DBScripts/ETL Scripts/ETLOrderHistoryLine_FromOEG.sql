
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
		CreatedBy,
		ModifiedBy

	) 
	select 
		distinct 
		shd.vd_OID,
		vd_ItemNum,
		vd_OptionDescr,
		vd_SkuDescr,
		vd_Qty,
		vd_ActualFreight,
		vd_ItemDescr,
		vd_ActualPrice,
		vd_ActualFreeFreight,

		'etl', 'etl'
	from
		OEGSystemStaging.dbo.HistoryOrder sho
		join OrderHistory oh on oh.ERPOrderNumber = sho.ord_Number
		join OEGSystemStaging.dbo.HistoryVendorDetail shd on shd.vd_OrderNum = sho.ord_Number
	where 
		not exists (select Id from OrderHistoryLine where OrderHistoryId = oh.Id and LineNumber = shd.vd_OID) 
		and shd.vd_OrderNum = 'ZJ995172'




/*
exec ETLOrderHistoryLine_FromOEG


*/

end


