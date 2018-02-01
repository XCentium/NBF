select productid from products where number like '56289%' and statusid = 1

select * from ProductSKUs where 
productid = 115815 and IsWebEnabled > 0

select * from ProductWebImages where productid = 231261 and (UsageId = 1 or IsPrimary = 1)
order by IsPrimary desc, WebSortOrder

select * from ProductSkusWebImages where productskuid in 
(
select productskuid from ProductSKUs where productid = 115815 and IsWebEnabled > 0
)
12374
12377
12378
12379

select * from LookupImageUsages


https://cdn-us-ec.yottaa.net/5407231486305e33060009aa/00f0b540b8130135e366123dfe2baf36.yottaa.net/v~19.b8/is/image/NationalBusinessFurniture/56289_4?hei=50&wid=50&qlt=100&yocs=_&yoloc=us
https://cdn-us-ec.yottaa.net/5407231486305e33060009aa/00f0b540b8130135e366123dfe2baf36.yottaa.net/v~19.b8/is/image/NationalBusinessFurniture/rmt-56289-fea1_lrg?wid=50&hei=50&qlt=100&yocs=_&yoloc=us
rmt-56289-fea1_lrg