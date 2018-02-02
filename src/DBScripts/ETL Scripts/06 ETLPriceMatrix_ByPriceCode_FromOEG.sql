
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLPriceMatrix_ByPriceCode_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLPriceMatrix_ByPriceCode_FromOEG
GO

create procedure ETLPriceMatrix_ByPriceCode_FromOEG 
	@brand int,
	@pricecode nvarchar(10),
	@break int
as
begin


	if @break = 1
	begin

		-- if this is first price break, then remove all price code records
		delete from PriceMatrix where CustomerKeyPart = @pricecode

		;with helper as
		(
		select 
			ROW_NUMBER() OVER (partition by p.Number order by p.Number, pp.Quantity) RowNumber, 
			p.Number, pp.Quantity, pp.Price 
		from 
			OEGSystemStaging.dbo.ProductPrices pp
			join OEGSystemStaging.dbo.products p on p.ProductId = pp.ProductId and p.BrandId = @brand
		where 
			EffStartDate < getdate() and effenddate > getdate()
			and pp.PricingTierId = 
					case
						when @pricecode = 'gsa' then 2 
						when @pricecode = 'sale' then 3 
						when @pricecode = 'medical' then 4
						else 1
					end
			--and p.Number in ('')
		)
		insert into PriceMatrix 
		([RecordType], [CurrencyCode], [Warehouse], [UnitOfMeasure], [CustomerKeyPart], [ProductKeyPart], [ActivateOn], [DeactivateOn], [CalculationFlags], [PriceBasis01], [AdjustmentType01], [AltAmount01],
		[BreakQty01], [Amount01], [CreatedBy], [ModifiedBy])
		select 
			'Customer Price Code/Product', 'USD', '', '', @pricecode, p.Id, dateadd(day, -1, SYSDATETIMEOFFSET()), null, '', 'O', 'A', 0,
			h.Quantity, h.Price, 'etl','etl'
		from
			helper h
			join Product p on p.ERPNumber = h.Number
			where h.RowNumber = 1
	end

	else

	begin

		;with helper as
		(
		select 
			ROW_NUMBER() OVER (partition by p.Number order by p.Number, pp.Quantity) RowNumber, 
			p.Number, pp.Quantity, pp.Price 
		from 
			OEGSystemStaging.dbo.ProductPrices pp
			join OEGSystemStaging.dbo.products p on p.ProductId = pp.ProductId and p.BrandId = @brand
		where 
			EffStartDate < getdate() and effenddate > getdate()
			and pp.PricingTierId = 
					case
						when @pricecode = 'gsa' then 2 
						when @pricecode = 'sale' then 3 
						when @pricecode = 'medical' then 4
						else 1
					end
			--and p.Number in ('')
		)
		update PriceMatrix set

		[PriceBasis02] = case when @break = 2 then 'O' else [PriceBasis02] end,
		[AdjustmentType02] = case when @break = 2 then 'A' else [AdjustmentType02] end,
		[BreakQty02] = case when @break = 2 then h.Quantity else [BreakQty02] end,
		[Amount02] = case when @break = 2 then h.Price else [Amount02] end,

		[PriceBasis03] = case when @break = 3 then 'O' else [PriceBasis03] end,
		[AdjustmentType03] = case when @break = 3 then 'A' else [AdjustmentType03] end,
		[BreakQty03] = case when @break = 3 then h.Quantity else [BreakQty03] end,
		[Amount03] = case when @break = 3 then h.Price else [Amount03] end,

		[PriceBasis04] = case when @break = 4 then 'O' else [PriceBasis04] end,
		[AdjustmentType04] = case when @break = 4 then 'A' else [AdjustmentType04] end,
		[BreakQty04] = case when @break = 4 then h.Quantity else [BreakQty04] end,
		[Amount04] = case when @break = 4 then h.Price else [Amount04] end,

		[PriceBasis05] = case when @break = 5 then 'O' else [PriceBasis05] end,
		[AdjustmentType05] = case when @break = 5 then 'A' else [AdjustmentType05] end,
		[BreakQty05] = case when @break = 5 then h.Quantity else [BreakQty05] end,
		[Amount05] = case when @break = 5 then h.Price else [Amount05] end,

		[PriceBasis06] = case when @break = 6 then 'O' else [PriceBasis06] end,
		[AdjustmentType06] = case when @break = 6 then 'A' else [AdjustmentType06] end,
		[BreakQty06] = case when @break = 6 then h.Quantity else [BreakQty06] end,
		[Amount06] = case when @break = 6 then h.Price else [Amount06] end,

		[PriceBasis07] = case when @break = 7 then 'O' else [PriceBasis07] end,
		[AdjustmentType07] = case when @break = 7 then 'A' else [AdjustmentType07] end,
		[BreakQty07] = case when @break = 7 then h.Quantity else [BreakQty07] end,
		[Amount07] = case when @break = 7 then h.Price else [Amount07] end,

		[PriceBasis08] = case when @break = 8 then 'O' else [PriceBasis08] end,
		[AdjustmentType08] = case when @break = 8 then 'A' else [AdjustmentType08] end,
		[BreakQty08] = case when @break = 8 then h.Quantity else [BreakQty08] end,
		[Amount08] = case when @break = 8 then h.Price else [Amount08] end,

		[PriceBasis09] = case when @break = 9 then 'O' else [PriceBasis09] end,
		[AdjustmentType09] = case when @break = 9 then 'A' else [AdjustmentType09] end,
		[BreakQty09] = case when @break = 9 then h.Quantity else [BreakQty09] end,
		[Amount09] = case when @break = 9 then h.Price else [Amount09] end,

		[PriceBasis10] = case when @break = 10 then 'O' else [PriceBasis10] end,
		[AdjustmentType10] = case when @break = 10 then 'A' else [AdjustmentType10] end,
		[BreakQty10] = case when @break = 10 then h.Quantity else [BreakQty10] end,
		[Amount10] = case when @break = 10 then h.Price else [Amount10] end,

		[PriceBasis11] = case when @break = 11 then 'O' else [PriceBasis11] end,
		[AdjustmentType11] = case when @break = 11 then 'A' else [AdjustmentType11] end,
		[BreakQty11] = case when @break = 11 then h.Quantity else [BreakQty11] end,
		[Amount11] = case when @break = 11 then h.Price else [Amount11] end

		from
			PriceMatrix pm
			join Product p on p.Id = pm.ProductKeyPart
			join helper h on h.Number = p.ERPNumber
		where 
			h.RowNumber = @break
			and pm.CustomerKeyPart = @pricecode

	end

/*

exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 1

select * from PriceMatrix
select top 1000 * from OEGSystemStaging.dbo.ProductPrices spp
where spp.PricingTierId = 1

*/

end


