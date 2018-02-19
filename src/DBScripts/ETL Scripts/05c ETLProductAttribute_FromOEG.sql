IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductAttribute_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductAttribute_FromOEG
GO

create procedure ETLProductAttribute_FromOEG  
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1

	declare @attributeName nvarchar(255)
	declare @attributeTypeId uniqueidentifier


	set @attributeName = 'Colors'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	
	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, slu.[Name], 0, 1, 'etl', 'etl'
	from OEGSystemStaging.dbo.LookupWebColors slu
	where slu.[Name] not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
	join OEGSystemStaging.dbo.ItemSKUsColors sd on sd.ItemSKUId = spsku.ItemSKUId
	join OEGSystemStaging.dbo.LookupWebColors slu on slu.ColorId = sd.ColorId
	join AttributeValue avalue on avalue.[Value] = slu.[Name]
	where avalue.AttributeTypeId = @attributeTypeId

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
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemsMaterials sd on sd.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.LookupItemMaterials slu on slu.MaterialId = sd.MaterialId
	join AttributeValue avalue on avalue.[Value] = slu.[Name]
	where avalue.AttributeTypeId = @attributeTypeId
	

	set @attributeName = 'Styles'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, slu.DisplayName, 0, 1, 'etl', 'etl'
	from OEGSystemStaging.dbo.ItemStyleDisplayNames slu
	where slu.DisplayName not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)
		and slu.BrandId = @brand


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemsStyles sd on sd.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemStyleDisplayNames slu on slu.StyleId = sd.StyleId
	join AttributeValue avalue on avalue.[Value] = slu.DisplayName
	where avalue.AttributeTypeId = @attributeTypeId



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
		and sp.BrandId = @brand
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



	set @attributeName = 'GSA'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from OEGSystemStaging.dbo.Products sp
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
	join AttributeValue avalue on avalue.[Value] = case when sisku.IsGSAEnabled = 0 then 'No' else 'Yes' end
	where avalue.AttributeTypeId = @attributeTypeId
	and sp.BrandId = @brand



	set @attributeName = 'Ships Today'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from OEGSystemStaging.dbo.Products sp
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
	join AttributeValue avalue on avalue.[Value] = case when sisku.NormalLeadTimeId = 1 and sisku.CurrentLeadTimeId is null then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId
	and sp.BrandId = @brand



	set @attributeName = 'New Product'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join AttributeValue avalue on avalue.[Value] = case when sp.FirstAvailableDate > dateadd(month, -6, getdate()) then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId



	set @attributeName = 'Top Rated'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.ProductRating spr on spr.ProductOID = sp.Number
	join AttributeValue avalue on avalue.[Value] = case when isnull(spr.Rating,0) >= 4 then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId


	set @attributeName = 'On Sale'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.ProductPrices spp on spp.ProductId = sp.ProductId
		and spp.EffStartDate < getdate() and spp.effenddate > getdate() and spp.PricingTierId = 3 and Quantity = 1
	join AttributeValue avalue on avalue.[Value] = case when isnull(spp.Price,0) > 0 then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId



	set @attributeName = 'Live Product Demo'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join AttributeValue avalue on avalue.[Value] = case when si.ShowroomLocation is not null then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId


	set @attributeName = 'Best Selling'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.ProductsHangTags spht on spht.ProductId = sp.ProductId
	left join OEGSystemStaging.dbo.HangTags sht on sht.HangTagId = spht.HangTagId
		and sht.BrandId = sp.BrandId and sht.[Description] = 'best seller'
	join AttributeValue avalue on avalue.[Value] = case when spht.HangTagId is null then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId




	set @attributeName = 'Clearance'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join AttributeValue avalue on avalue.[Value] = case when sp.IsClearance = 1 then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId





	set @attributeName = 'Green'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Yes')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Yes', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'No')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'No', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = 1
	left join OEGSystemStaging.dbo.ItemsAttributeValues sd on sd.ItemId = sp.ItemId
	left join OEGSystemStaging.dbo.LookupItemAttributeValues slu on slu.AttributeValueId = sd.AttributeValueId
		and slu.[Name] in ('Greenguard','Greenguard Child/School')
	left join OEGSystemStaging.dbo.LookupItemAttributes sluName on sluName.AttributeId = slu.AttributeId
		and sluName.[Name] = 'Eco Friendly' 
	join AttributeValue avalue on avalue.[Value] = case when sd.AttributeValueId is not null then 'Yes' else 'No' end
	where avalue.AttributeTypeId = @attributeTypeId


/*

exec ETLProductAttribute_FromOEG
exec ETLProductAttribute_ToInsite
*/
end