
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLPriceMatrix_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLPriceMatrix_FromOEG
GO

create procedure ETLPriceMatrix_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	truncate table PriceMatrix 

	-- regular price

	;with helper as
	(
	select 
		ROW_NUMBER() OVER (partition by pp.ProductId order by pp.ProductId) RowNumber, 
		pp.ProductId, pp.Quantity, pp.Price 
	from 
		OEGSystemStaging.dbo.ProductPrices pp
		join OEGSystemStaging.dbo.products p on p.ProductId = pp.ProductId and p.BrandId = 1
	where 
		EffStartDate < getdate()
		and effenddate > getdate()
		and pp.PricingTierId = 1
		--and pp.productid in (82186,83689,115857)
	)
	insert into PriceMatrix 
	([RecordType], [CurrencyCode], [Warehouse], [UnitOfMeasure], [CustomerKeyPart], [ProductKeyPart], 
	[ActivateOn], [DeactivateOn], [CalculationFlags],
	[PriceBasis01], [AdjustmentType01], [AltAmount01],
	[BreakQty01], [Amount01],
	[CreatedBy], [ModifiedBy])
	select 
		'Customer Price Code/Product', 'USD', '', '', '', p.Id, 
		dateadd(day, -1, SYSDATETIMEOFFSET()), null, '',
		'O', 'A', 0,
		h.Quantity, h.Price,
		'etl','etl'
	from
		helper h
		join OEGSystemStaging.dbo.Products sp on sp.ProductId = h.ProductId
		join Product p on p.ERPNumber = sp.Number
		where RowNumber = 1




/*
exec ETLPriceMatrix_FromOEG
select * from PriceMatrix

select top 1000 * from OEGSystemStaging.dbo.ProductPrices spp
where spp.PricingTierId = 1

*/

end


