
		;with helper as
		(
		select 
			ROW_NUMBER() OVER (partition by spsku.ProductSKUId order by spsku.ProductSKUId, spp.Quantity) RowNumber, 
			sp.Number, spsku.OptionCode, spp.Quantity, spp.Price 
		from 
			OEGSystemStaging.dbo.ProductPrices spp
			join OEGSystemStaging.dbo.products sp on sp.ProductId = spp.ProductId and sp.BrandId = 1
			join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
		where 
			spp.EffStartDate < getdate() and spp.effenddate > getdate()
			and spp.PricingTierId = 1
					--case
					--	when @pricecode = 'gsa' then 2 
					--	when @pricecode = 'sale' then 3 
					--	when @pricecode = 'medical' then 4
					--	else 1
					--end
			--and sp.Number in ('10011')
		)
		--insert into PriceMatrix 
		--([RecordType], 
		--[CurrencyCode], [Warehouse], [UnitOfMeasure], [CustomerKeyPart], [ProductKeyPart], [ActivateOn], [DeactivateOn], [CalculationFlags], [PriceBasis01], [AdjustmentType01], [AltAmount01],
		--[BreakQty01], [Amount01], [CreatedBy], [ModifiedBy])
		select 
			'Product', 
			'USD', '', '', '', p.Id, dateadd(day, -1, SYSDATETIMEOFFSET()), null, '', 'O', 'A', 0,
			h.Quantity, h.Price, 'etl','etl'
		from
			helper h
			join Product p on p.ERPNumber = h.Number + '_' + h.OptionCode
			where h.RowNumber = 1

select erpnumber,* from product where id = '7DBCD8B9-87FD-E711-A98C-A3E0F1200094'
select erpnumber, * from product where erpnumber like '%85805_2%'
select * from PriceMatrix where ProductKeyPart = '129245BF-87FD-E711-A98C-A3E0F1200094'