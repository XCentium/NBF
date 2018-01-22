select top 1000 * from items where itemid = 160295
select * from LookupItemClasses where ClassId = 3

select top 1000 * from ItemsWebCategories where ItemId = 160295
select * from LookupItemWebCategories

select top 100 * from ItemWebCategoryDisplayNames where BrandId = 1 and itemid

select top 100 sc.*, l.* from ItemsSubClasses sc
join LookupItemSubClasses l on l.SubClassId = sc.SubClassId
where itemid = 160295

select * from ProductSKUs where ProductSKUId = 2747498
select * from Products where ProductId = 178133
select * from LookupItemStatuses where Id = 2

select * from LookupItemStatuses

select * from LookupItemSubClasses

select * from ItemDimensions
select top 1000 * from products
order by itemid

select top 1000 * from ItemSKUs

select * from LookupUnitOfMeasures
select * from LookupWebDescriptionTypes

select * from LookupItemAttributes
select * from LookupItemAttributeValues where AttributeId = 39
select * from LookupWebColors

select * from ItemsWebCategories
select * from LookupItemWebCategories

select * from ItemClassesStyles

select * from LookupItemStyles

select * from LookupItemClasses where ClassId = 3

select top 100 * from ItemsSubClasses
select * from LookupItemSubClasses where SubClassId in (1,24,41,54,58,59,66,67,95,106)

select * from ItemsSubClasses where itemid = 160295
select top 100 * from Items where itemid = 160295
select * from products where number = '56046'
select * from ItemsMaterials where itemid = 160295

select * from LookupItemMaterials

select ItemSKUId, SKUNumber,itemid, OptionCode, Description, * from ItemSKUs where ItemId = 160295
select * from ProductSKUs where productid = 221538


select top 1000 * from ItemSwatchGroups where itemid = 126022
select top 1000 * from [ItemSwatches] where GroupId = 2605
select top 1000 * from ItemSKUsSwatches where SwatchId =172049 

select * from LookupSwatchTypes
select top 100 * from ProductSKUs
select * from products where ItemId = 160295


select * from ProductsWebDescriptions where ProductId = 83397
select * from ProductsWebDescriptions where ProductId = 56786

select top 100 * from Items where ClassId = 3

select * from ItemSKUsColors where ItemSKUId = 103455

select * from ItemsMaterials where itemid = 446

select * from LookupItemMaterials where MaterialId = 21

