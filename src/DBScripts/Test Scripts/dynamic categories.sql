
select top 1000 * from items


select top 1000 * from ItemSwatchGroups where itemid = 107020

select Itemid, name, count(*)
from ItemSwatchGroups
where name !=  ''
group by Itemid, name
having count(*) > 1

select top 1000 * from [ItemSwatches] where GroupId = 62962

select groupid, name, count(*)
from [ItemSwatches]
where name !=  ''
group by groupid, name
having count(*) > 1

select * from [Insite.NBF].dbo.CategoryProduct

select top 1000 IsGSAEnabled,* from ItemSKUs -- GSA
select top 10000 * from ProductPrices where PricingTierId = 3 and Quantity = 1 and productid = 222479 -- for onsale
select number,* from products where productid = 222479
select * from products where number = '41899'
select top 1000 FirstAvailableDate,* from Products -- new products (possiblyy 6 months)
select top 1000 NormalLeadTimeId,* from ItemSKUs where NormalLeadTimeId=1 and CurrentLeadTimeId is null  -- ships today

select top 100 * from OEGSystemStaging.dbo.ProductRating -- top rated
select productoid, count(*) from  OEGSystemStaging.dbo.ProductRating 
group by productoid
having count(*) = 1
select top 100000 ERPNumber,* from [Insite.NBF].dbo.Product

select * from ProductsWebDescriptions