select * from products where itemid=121366
select * from [Insite.NBF].dbo.Product where ERPNumber = '31791'
select * from ItemsMaterials
select * from LookupItemMaterials

select * from ItemsStyles where StyleId = 34

select * from LookupItemStyles where styleid in (select StyleId from ItemsStyles)

select * from ItemStyleDisplayNames where BrandId = 1 and styleid in (select StyleId from ItemsStyles)

select * from ItemsRooms
select * from LookupItemRooms

select * from ItemsAttributeValues where AttributeValueId = 270
select * from LookupItemAttributeValues
select * from LookupItemAttributes

select number, * from products 
where ItemId = 8748

select * from [Insite.NBF].dbo.ProductAttributeValue
select ERPNumber,* from [Insite.NBF].dbo.Product where id = '8CD534D6-C7FC-E711-A98C-A3E0F1200094'


select * from ItemDimensions
select * from ItemSKUsColors
select * from LookupWebColors

