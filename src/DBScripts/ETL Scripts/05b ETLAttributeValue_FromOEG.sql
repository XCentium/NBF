IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLAttributeValue_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLAttributeValue_FromOEG
GO

create procedure ETLAttributeValue_FromOEG  
(
	@attributeName nvarchar(255)
)
as
begin


	declare @attributeTypeId uniqueidentifier
	
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, slu.[Name], 0, 1, 'etl', 'etl'
	from OEGSystemStaging.dbo.LookupItemAttributeValues slu
	join OEGSystemStaging.dbo.LookupItemAttributes sluName on sluName.AttributeId = slu.AttributeId
		and sluName.[Name] = @attributeName
	where slu.[Name] not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
	join OEGSystemStaging.dbo.ItemsAttributeValues sd on sd.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.LookupItemAttributeValues slu on slu.AttributeValueId = sd.AttributeValueId
	join OEGSystemStaging.dbo.LookupItemAttributes sluName on sluName.AttributeId = slu.AttributeId
		and sluName.[Name] = @attributeName
	join AttributeValue avalue on avalue.[Value] = slu.[Name]
	where avalue.AttributeTypeId = @attributeTypeId

end