

/*
delete from ProductAttributeValue
delete from CategoryAttributeValue 
delete from CategoryAttributeType where CreatedBy = 'etl'
delete from AttributeValue where CreatedBy = 'etl'
delete from AttributeType where CreatedBy = 'etl'


delete from Category where CreatedBy = 'etl'
delete from Content where CreatedBy = 'etl'
delete from ContentManager where CreatedBy = 'etl'
delete from CategoryProduct where CreatedBy = 'etl'


delete from StyleTraitValueProduct 
delete from StyleTraitValue where createdby = 'etl'
delete from StyleTrait where createdby = 'etl'
delete from product where createdby = 'etl'
delete from StyleClass where createdby = 'etl'

delete from Vendor where CreatedBy = 'etl'

*/

/*
exec ETLVendor_FromOEG
exec ETLProduct_FromOEG
exec ETLCategory_FromOEG
exec ETLCategoryProduct_FromOEG
exec ETLProductRichDescription_FromOEG
exec ETLProductAttribute_FromOEG

*/

/*
exec ETLVendor_ToInsite
exec ETLProduct_ToInsite
exec ETLCategory_ToInsite
exec ETLCategoryProduct_ToInsite
exec ETLProductRichDescription_ToInsite
exec ETLProductAttribute_ToInsite
*/