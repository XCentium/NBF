/*
select deliveryamount,* from products

select distinct primaryvendorid from products
select top 1000 IsGSAEnabled,* from ItemSKUs

select top 1000 * from ProductPrices pp
join products p on p.ProductId = pp.ProductId and p.BrandId = 1
where pp.productid = 74080
and EffStartDate < getdate()
and effenddate > getdate()
and pp.PricingTierId = 1
order by pp.PricingTierId, pp.Quantity


select pp.ProductId, max(pp.Quantity), count(*)
from ProductPrices pp
join products p on p.ProductId = pp.ProductId and p.BrandId = 1
and pp.EffStartDate < getdate()
and pp. effenddate > getdate()
and pp.PricingTierId = 1
group by pp.productid
having count(*) = 5 
order by pp.ProductId
*/

	with helper as
	(
	select 
		ROW_NUMBER() OVER (partition by pp.ProductId order by pp.ProductId) RowNumber, 
		pp.ProductId, pp.Quantity, pp.Price 
	from 
		ProductPrices pp
		join products p on p.ProductId = pp.ProductId and p.BrandId = 1
	where 
		EffStartDate < getdate()
		and effenddate > getdate()
		and pp.PricingTierId = 1
		--and pp.productid in (82186,83689,115857)
	)
	select h.*
		from helper h
		join OEGSystemStaging.dbo.Products sp on sp.ProductId = h.ProductId
		join InsiteETL.dbo.Product p on p.ERPNumber = sp.Number
		where RowNumber = 6

	--order by ProductId, Quantity
