
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductAttribute_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductAttribute_ToInsite
GO

create procedure ETLProductAttribute_ToInsite  

as
begin

	insert into [Insite.NBF].dbo.AttributeType 
	(Id, [Name], IsActive, Label, IsFilter, IsComparable, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, [Name], IsActive, Label, IsFilter, IsComparable, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from AttributeType etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.AttributeType)


	insert into [Insite.NBF].dbo.AttributeValue 
	(Id, AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from AttributeValue etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.AttributeValue)

	insert into [Insite.NBF].dbo.CategoryAttributeType 
	(Id, CategoryId, AttributeTypeId, SortOrder, IsActive, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, CategoryId, AttributeTypeId, SortOrder, IsActive, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from CategoryAttributeType etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.CategoryAttributeType)

	-- this delete is OK because there is no Key on this table. It's just an association table.
	delete from [Insite.NBF].dbo.ProductAttributeValue 
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.CreatedBy = 'etl')

	-- we can always insert from this table since we are guarantied not to have any ETL records in here based on prev statement
	insert into [Insite.NBF].dbo.ProductAttributeValue 
	(ProductId, AttributeValueId)
	select ProductId, AttributeValueId
	from ProductAttributeValue etl

/*

exec ETLProductAttribute_ToInsite

*/

end
