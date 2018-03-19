select top 1000 * from pricematrix where CustomerKeyPart = 'sale' and ProductKeyPart in (select ProductId from CategoryProduct)
and ProductKeyPart in (select Id from Product where IsDiscontinued = 0)
select Amount01, * from PriceMatrix where ProductKeyPart = '69C3D8B9-87FD-E711-A98C-A3E0F1200094'
select ERPNumber, BasicListPrice, BasicSalePrice, BasicSaleStartDate, * from Product where id = '69C3D8B9-87FD-E711-A98C-A3E0F1200094'

select * from Product where erpnumber = '40584'

select * from CategoryProduct where ProductId = '008F2CC0-87FD-E711-A98C-A3E0F1200094'

update Product set
	BasicSalePrice = 0,
	BasicSaleStartDate = null

update Product set
	BasicSalePrice = pm.Amount01,
	BasicSaleStartDate = '1/1/2010'
from Product p
join PriceMatrix pm on pm.ProductKeyPart = p.Id 
	and pm.CustomerKeyPart = 'sale'
where
	p.IsDiscontinued = 0
	and p.Id in (select ProductId from CategoryProduct)
