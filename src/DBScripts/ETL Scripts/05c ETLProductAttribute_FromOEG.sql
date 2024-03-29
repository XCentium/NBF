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


	-- start price ranges

	set @attributeName = 'Price Range'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Under $100')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Under $100', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$100 - $199')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$100 - $199', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$200 - $299')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$200 - $299', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$300 - $399')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$300 - $399', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$400 - $499')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$400 - $499', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$500 - $599')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$500 - $599', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$600 - $699')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$600 - $699', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$700 - $799')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$700 - $799', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$800 - $899')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$800 - $899', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$900 - $999')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$900 - $999', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$1000 - $1099')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$1000 - $1099', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$1100 - $1199')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$1100 - $1199', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$1200 - $1299')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$1200 - $1299', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$1300 - $1399')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$1300 - $1399', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$1400 - $1499')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$1400 - $1499', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$1500 - $1999')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$1500 - $1999', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = '$2000 - $2500')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, '$2000 - $2500', 0, 1, 'etl', 'etl'
	end
	if not exists (select 1 from AttributeValue where AttributeTypeId = @attributeTypeId and [value] = 'Over $2500')
	begin
		insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
		select @attributeTypeId, 'Over $2500', 0, 1, 'etl', 'etl'
	end


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	-- all base products are set to a price range
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 0 and 99.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = 'Under $100'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 100 and 199.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$100 - $199'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 200 and 299.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$200 - $299'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 300 and 399.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$300 - $399'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 400 and 499.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$400 - $499'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 500 and 599.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$500 - $599'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 600 and 699.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$600 - $699'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 700 and 799.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$700 - $799'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 800 and 899.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$800 - $899'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 900 and 999.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$900 - $999'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 1000 and 1099.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$1000 - $1099'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 1100 and 1199.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$1100 - $1199'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 1200 and 1299.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$1200 - $1299'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 1300 and 1399.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$1300 - $1399'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 1400 and 1499.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$1400 - $1499'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 1500 and 1999.99 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$1500 - $1999'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price between 2000 and 2500 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = '$2000 - $2500'	where avalue.AttributeTypeId = @attributeTypeId

	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id--, p.ERPNumber, pp.Price 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ProductPrices pp on pp.ProductId = sp.ProductId and pp.Price > 2500 and pp.PricingTierId = 1 and pp.Quantity = 1  and pp.EffStartDate < getdate() and pp.effenddate > getdate()
	join AttributeValue avalue on avalue.[Value] = 'Over $2500'	where avalue.AttributeTypeId = @attributeTypeId

	--- end price ranges


	set @attributeName = 'HideInSearch'
	exec ETLAttribute_FromOEG @attributeName, 0
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

	-- all base products are set to No
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join AttributeValue avalue on avalue.[Value] = 'No'
	where avalue.AttributeTypeId = @attributeTypeId

	-- all swatches are set to Yes
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
		join OEGSystemStaging.dbo.ItemSwatches sis on convert(nvarchar(max),sis.SwatchId) = RIGHT(p.ERPNumber,CHARINDEX(':',REVERSE(p.ERPNumber))-1) 
	join AttributeValue avalue on avalue.[Value] = 'Yes'
	where avalue.AttributeTypeId = @attributeTypeId
		and p.ContentManagerId = '00000000-0000-0000-0000-000000000000'




	set @attributeName = 'Type'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	
	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, sicdn.DisplayName, 0, 1, 'etl', 'etl'
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemsCategories sic on sic.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemCategoryDisplayNames sicdn on sicdn.CategoryId = sic.CategoryId
		and sicdn.BrandId = @brand
	where sicdn.DisplayName not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemsCategories sic on sic.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemCategoryDisplayNames sicdn on sicdn.CategoryId = sic.CategoryId
		and sicdn.BrandId = @brand
	join AttributeValue avalue on avalue.[Value] = sicdn.DisplayName
	where avalue.AttributeTypeId = @attributeTypeId



	set @attributeName = 'Brand'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	
	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, v.DisplayName, 0, 1, 'etl', 'etl'
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Vendors v on v.VendorId = sp.DisplayVendorId
	where v.DisplayName not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Vendors v on v.VendorId = sp.DisplayVendorId
	join AttributeValue avalue on avalue.[Value] = v.DisplayName
	where avalue.AttributeTypeId = @attributeTypeId



	set @attributeName = 'Collection'
	exec ETLAttribute_FromOEG @attributeName
	select top 1 @attributeTypeId = Id from AttributeType where [Name] = @attributeName

	
	-- since there is no "key" on this table it's tough to do an "update", we are just going to add new ones and manually delete unused ones (if needed)
	insert into AttributeValue (AttributeTypeId, [Value], SortOrder, IsActive, CreatedBy, ModifiedBy)
	select distinct @attributeTypeId, sic.[Name], 0, 1, 'etl', 'etl'
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemCollections sic on sic.CollectionId = si.CollectionId
	where sic.[Name] not in (select [Value] from AttributeValue where AttributeTypeId = @attributeTypeId)


	-- since there is no primary key here, we can just delete all associations and repopulate
	delete from ProductAttributeValue
	where AttributeValueId in ( select avalue.Id from AttributeValue avalue
	join AttributeType atype on atype.Id = avalue.AttributeTypeId and atype.Id = @attributeTypeId)

	
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemCollections sic on sic.CollectionId = si.CollectionId
	join AttributeValue avalue on avalue.[Value] = sic.[Name]
	where avalue.AttributeTypeId = @attributeTypeId


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
		and spsku.EffStartDate < getdate() and spsku.effenddate > getdate() and spsku.IsWebEnabled = 1
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

	set @attributeName = 'Number of Workstations'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Partition Features'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Privacy'
	exec ETLAttribute_FromOEG @attributeName
	exec ETLAttributeValue_FromOEG @attributeName

	set @attributeName = 'Clean With'
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

	;with dataRollup as
	(
		select distinct sp.Number ERPNumber
		from OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
			and spsku.EffStartDate < getdate() and spsku.effenddate > getdate() and spsku.IsWebEnabled = 1
		join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
		join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
		where sisku.IsGSAEnabled = 1
		and sp.BrandId = @brand
	)
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p 
	left join dataRollup dr on dr.ERPNumber = p.ERPNumber
	join AttributeValue avalue on avalue.[Value] = case when dr.ERPNumber is null then 'No' else 'Yes' end
	where avalue.AttributeTypeId = @attributeTypeId
	and p.ERPNumber not like '%[_]%' and p.ERPNumber not like '%:%'


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

	
	;with dataRollup as
	(
		select sp.Number ERPNumber 
		from OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
			and spsku.EffStartDate < getdate() and spsku.effenddate > getdate() and spsku.IsWebEnabled = 1
		join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
		join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
		where sisku.NormalLeadTimeId = 1 and sisku.CurrentLeadTimeId is null
		and sp.BrandId = @brand
	)
	insert into ProductAttributeValue (ProductId, AttributeValueId) 
	select distinct p.Id, avalue.Id 
	from Product p 
	left join dataRollup dr on dr.ERPNumber = p.ERPNumber
	join AttributeValue avalue on avalue.[Value] = case when dr.ERPNumber is null then 'No' else 'Yes' end
	where avalue.AttributeTypeId = @attributeTypeId
	and p.ERPNumber not like '%[_]%' and p.ERPNumber not like '%:%'



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

*/
end