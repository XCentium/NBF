select productid from products where number like '56289%' and statusid = 1

select * from products where Number = '41899'
select * from  ProductSKUs where ProductId = 222479 and OptionCode = '11'

select * from ProductSKUs where 
productid = 115815 and IsWebEnabled > 0

select * from ProductWebImages where productid = 41899 and (UsageId = 1 or IsPrimary = 1)
order by IsPrimary desc, WebSortOrder

select * from ProductSkusWebImages where productskuid in 
(
select productskuid from ProductSKUs where productid = 222479 and IsWebEnabled > 0
)
select * from ProductWebImages where productid = 222479 

select pswi.ProductSKUId, count(*) from ProductSkusWebImages pswi
join ProductWebImages pwi on pwi.WebImageId = pswi.WebImageId
	and UsageId = 2
where productskuid in 
(
select productskuid from ProductSKUs where IsWebEnabled > 0
)
group by pswi.ProductSKUId
having count(*) > 1
order by pswi.ProductSKUId


12374
12377
12378
12379

select * from ProductWebImages pwi
join ProductSkusWebImages pswi on pswi.ProductSKUId
where pwi.productid = 115815 and (pwi.UsageId = 1 or pwi.IsPrimary = 1)

order by IsPrimary desc, WebSortOrder

select * from LookupImageUsages


https://cdn-us-ec.yottaa.net/5407231486305e33060009aa/00f0b540b8130135e366123dfe2baf36.yottaa.net/v~19.b8/is/image/NationalBusinessFurniture/56289_4?hei=50&wid=50&qlt=100&yocs=_&yoloc=us
https://cdn-us-ec.yottaa.net/5407231486305e33060009aa/00f0b540b8130135e366123dfe2baf36.yottaa.net/v~19.b8/is/image/NationalBusinessFurniture/rmt-56289-fea1_lrg?wid=50&hei=50&qlt=100&yocs=_&yoloc=us
rmt-56289-fea1_lrg