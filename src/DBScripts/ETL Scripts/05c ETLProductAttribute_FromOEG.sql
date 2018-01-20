IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductAttribute_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductAttribute_FromOEG
GO

create procedure ETLProductAttribute_FromOEG  
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @attributeName nvarchar(255)
	declare @attributeTypeId uniqueidentifier


	set @attributeName = 'Materials'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	
	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, slu.[Name], 0, 1, 'etl', 'etl'
	from OEGSystemStaging.dbo.LookupItemMaterials slu
	where slu.[Name] not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
	join OEGSystemStaging.dbo.ItemsMaterials sd on sd.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.LookupItemMaterials slu on slu.MaterialId = sd.MaterialId
	join AttributeValue avalue on avalue.[Value] = slu.[Name]
	where avalue.AttributeTypeId = @attributeTypeId
	

	--- TODO
	set @attributeName = 'Styles'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName



	set @attributeName = 'Rooms'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, slu.[Name], 0, 1, 'etl', 'etl'
	from OEGSystemStaging.dbo.LookupItemRooms slu
	where slu.[Name] not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
	join OEGSystemStaging.dbo.ItemsRooms sd on sd.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.LookupItemRooms slu on slu.RoomId = sd.RoomId
	join AttributeValue avalue on avalue.[Value] = slu.[Name]
	where avalue.AttributeTypeId = @attributeTypeId

	set @attributeName = 'Area of Use'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName
	
	set @attributeName = 'Boards or Panels'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Number of Drawers'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Facing Direction'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Height'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Floor Use'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Length'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Quality'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Shape'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Number of Shelves'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Size'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Features'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Width'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'TV Size'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Lectern Sound'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Stage Feature'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Supports Up To'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Caddy Type'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Eco Friendly'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

/*

exec ETLProductAttribute_FromOEG
exec ETLProductAttribute_ToInsite
*/
end