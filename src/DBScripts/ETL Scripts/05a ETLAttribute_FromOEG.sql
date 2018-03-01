
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLAttribute_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLAttribute_FromOEG
GO

create procedure ETLAttribute_FromOEG  
(
	@attributeName nvarchar(255)
)
as
begin

	-- helper function to crate the attribute name and ensure that every 
	-- category can access it so we can assign it to child products as needed 
	declare @attributeTypeId uniqueidentifier


	if not exists (select Id from AttributeType where [Name] = @attributeName)
	begin
		insert into AttributeType 
		([Name], IsActive, Label, IsFilter, IsComparable, CreatedBy, ModifiedBy)
		values (@attributeName, 1, @attributeName, 1, 1, 'etl', 'etl')
	end

	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName


	insert into CategoryAttributeType 
	(CategoryId, AttributeTypeId, SortOrder, IsActive, CreatedBy, ModifiedBy)
	select 
		c.Id, @attributeTypeId, 0, 1, 'etl', 'etl'
	from
		Category c
	where 
		c.CreatedBy = 'etl'
		--and c.Id  not in (select distinct ParentId from Category where ParentId is not null)
		and not exists (select Id from CategoryAttributeType where CategoryId = c.Id and AttributeTypeId = @attributeTypeId)



/*
ETLAttribute_FromOEG 'd'

select * from AttributeType
select * from CategoryAttributeType

-- delete from AttributeType
-- delete from CategoryAttributeType
*/

end


