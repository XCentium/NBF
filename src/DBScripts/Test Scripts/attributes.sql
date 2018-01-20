
select * from ItemsMaterials
select * from LookupItemMaterials

select * from ItemsStyles
select * from LookupItemStyles where styleid in (select StyleId from ItemsStyles)

select * from ItemStyleDisplayNames

select * from ItemsRooms
select * from LookupItemRooms

select * from ItemsAttributeValues where AttributeValueId = 270
select * from LookupItemAttributeValues
select * from LookupItemAttributes

select number, * from products 
where ItemId = 8748

select * from [Insite.NBF].dbo.ProductAttributeValue
select ERPNumber,* from [Insite.NBF].dbo.Product where id = '8CD534D6-C7FC-E711-A98C-A3E0F1200094'