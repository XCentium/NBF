	-- these are all the option code dups
	select  
		sp.Number, spsku.OptionCode, count(*)
	from 
		Products sp
		join ProductSKUs spsku on spsku.ProductId = sp.ProductId
	where sp.brandid = 1
	group by
		sp.Number, spsku.OptionCode
	having count(*) > 1

	-- this has 2x OptionCode 18
	select sp.ProductId ,sp.number, sp.BrandId, spsku.*
	from 
		Products sp
		join ProductSKUs spsku on spsku.ProductId = sp.ProductId
	where sp.number='43028'
	and sp.brandid = 1

select number, * from products 
where number like '%[_]%'