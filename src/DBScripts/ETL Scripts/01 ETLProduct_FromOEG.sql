IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProduct_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProduct_FromOEG
GO

create procedure ETLProduct_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1

	--base product styles per website
	
	insert into StyleClass
	([Name],[Description],[IsActive],CreatedBy,ModifiedBy)
	select  
		sp.Number [Name],
		sp.Number + ' variants' [Description],
		1,'etl','etl'
	from 
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		join OEGSystemStaging.dbo.LookupItemClasses sic on sic.ClassId = si.ClassId
			and sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Misc.', 'Parts')
		left join OEGSystemStaging.dbo.ProductsWebDescriptions spwd on spwd.ProductId = sp.ProductId
			and spwd.TypeId = 1
	where 
		sp.BrandId = @brand
		and isnull(sp.Number,'') != ''
		and sp.Number not like '%[_]%'
		and sp.Number not in (select [Name] from StyleClass)

	--base product info per website

	insert into Product 
	(ERPNumber, [Name],ERPDescription, ShortDescription,  UrlSegment, ContentManagerId, StyleClassId)
	select  
		sp.Number ERPNumber,
		'',
		ltrim(rtrim(isnull(si.[Description],''))) ERPDescription,
		ltrim(rtrim(isnull(spwd.[Description],''))) ShortDescription,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(spwd.[Description],''))) + '-' + sp.Number),'/','-')) UrlSegment,
		NEWID() ContentManagerId,
		styles.Id StyleClassId
	from 
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		left join OEGSystemStaging.dbo.ProductsWebDescriptions spwd on spwd.ProductId = sp.ProductId
			and spwd.TypeId = 1
		join OEGSystemStaging.dbo.LookupItemClasses sic on sic.ClassId = si.ClassId
			and sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Misc.', 'Parts')
		join StyleClass styles on styles.[Name] = sp.Number
	where 
		sp.BrandId = @brand
		and isnull(sp.Number,'') != ''
		and sp.Number not like '%[_]%'
		and sp.Number not in (select ERPNumber from Product)
	

	update Product set
		ERPDescription = ltrim(rtrim(isnull(si.[Description],''))),
		ShortDescription = ltrim(rtrim(isnull(spwd.[Description],''))),
		UnitOfMeasure = isnull(luUOM.Code,''),
		UnitOfMeasureDescription = isnull(luUOM.[Name],''),
		ShippingWeight = isnull(scd.[Weight],0),
		ShippingLength = isnull(scd.[Length],0),
		ShippingWidth = isnull(scd.[Width],0),
		ShippingHeight = isnull(scd.[Height],0),
		QtyPerShippingPackage = isnull(si.QtyPerCarton,0),
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(spwd.[Description],''))) + '-' + sp.Number),'/','-')),
		IsDiscontinued = case when luStatus.Name = 'Active' then 0 else 1 end,
		ActivateOn = sp.FirstAvailableDate,
		DeactivateOn = case when luStatus.Name = 'Active' then null else dateadd(day, -1, SYSDATETIMEOFFSET()) end,
		VendorId = v.Id,
		CreatedOn = isnull(sp.CreatedDate,SYSDATETIMEOFFSET()),
		CreatedBy = 'etl',
		ModifiedOn = isnull(sp.ModifiedDate,SYSDATETIMEOFFSET()),
		ModifiedBy = 'etl'
	from 
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		left join OEGSystemStaging.dbo.ProductsWebDescriptions spwd on spwd.ProductId = sp.ProductId
			and spwd.TypeId = 1
		left join OEGSystemStaging.dbo.LookupUnitOfMeasures luUOM on luUOM.Id = si.UnitOfMeasureId
		left join OEGSystemStaging.dbo.ItemCartonDimensions scd on scd.ItemId = si.ItemId
		left join OEGSystemStaging.dbo.LookupItemStatuses luStatus on luStatus.Id = sp.StatusId
		left join OEGSystemStaging.dbo.Vendors sv on sv.VendorId = sp.DisplayVendorId
			join Vendor v on v.VendorNumber = sv.Code
		join Product p on p.ERPNumber = sp.Number
	where 
		sp.BrandId = @brand

		
	--variant product info per website

	insert into Product 
	(ERPNumber, [Name], ERPDescription, ShortDescription,  UrlSegment, ContentManagerId)
	select  
		sp.Number + '_' + spsku.OptionCode ERPNumber,
		'',
		ltrim(rtrim(isnull(sisku.[Description],''))) ERPDescription,
		ltrim(rtrim(isnull(spsku.[Description],''))) ShortDescription,
		sp.Number + '-' + convert(nvarchar(max),spsku.ProductSKUId) UrlSegment,
		NEWID() ContentManagerId
	from 
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
		join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
		join OEGSystemStaging.dbo.LookupItemClasses sic on sic.ClassId = si.ClassId
			and sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Misc.', 'Parts')
	where 
		sp.BrandId = @brand
		and isnull(sp.Number,'') != ''
		and sp.Number not like '%[_]%'
		and sp.Number + '_' + spsku.OptionCode not in (select ERPNumber from Product)


	update Product set
		ERPDescription = ltrim(rtrim(isnull(sisku.[Description],''))),
		ShortDescription = ltrim(rtrim(isnull(spsku.[Description],''))),
		UnitOfMeasure = isnull(luUOM.Code,''),
		UnitOfMeasureDescription = isnull(luUOM.[Name],''),
		Sku = isnull(sisku.SKUNumber,''),
		ShippingWeight = isnull(scd.[Weight],0),
		ShippingLength = isnull(scd.[Length],0),
		ShippingWidth = isnull(scd.[Width],0),
		ShippingHeight = isnull(scd.[Height],0),
		QtyPerShippingPackage = isnull(si.QtyPerCarton,0),
		UrlSegment = sp.Number + '-' + convert(nvarchar(max),spsku.ProductSKUId),
		IsDiscontinued = case when luStatus.Name = 'Active' then 0 else case when spsku.EffEndDate > getdate() then 0 else 1 end end,
		ActivateOn = spsku.EffStartDate,
		DeactivateOn = case when luStatus.Name = 'Active' then spsku.EffEndDate else dateadd(day, -1, SYSDATETIMEOFFSET()) end,
		UPCCode = isnull(sisku.UPCCode,''),
		ManufacturerItem = spsku.OptionCode,
		CreatedOn = isnull(spsku.CreatedDate,SYSDATETIMEOFFSET()),
		CreatedBy = 'etl',
		ModifiedOn = isnull(spsku.ModifiedDate,SYSDATETIMEOFFSET()),
		ModifiedBy = 'etl'
	from 
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
		join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
		left join OEGSystemStaging.dbo.LookupUnitOfMeasures luUOM on luUOM.Id = si.UnitOfMeasureId
		left join OEGSystemStaging.dbo.ItemCartonDimensions scd on scd.ItemId = si.ItemId
		left join OEGSystemStaging.dbo.LookupItemStatuses luStatus on luStatus.Id = sp.StatusId
		join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
	where 
		sp.BrandId = @brand

	-- we need content managers for all these products
	insert into ContentManager
	(Id, [Name], CreatedBy, ModifiedBy)
	select ContentManagerId, 'Product', 'etl', 'etl'
	from Product
	where ContentManagerId not in (select Id from ContentManager)

	-- tie up the style parent for each of the variants
	;with parentProduct as
	(
	select 
		p.Id, p.ERPNumber
	from 
		Product p
	where
		p.ERPNumber not like '%[_]%'
	)
	update Product 
	set StyleParentId = pp.Id
	from Product p
	join parentProduct pp on pp.ERPNumber = rtrim(left(p.ERPNumber, CHARINDEX('_', p.ERPNumber) - 1))
	where 
		p.ERPNumber like '%[_]%'


	insert into StyleTrait
	([StyleClassId], [Name], [SortOrder], [Description], CreatedBy, ModifiedBy)
	select 
		styles.Id, sisg.[Name], sisg.WebSortOrder, convert(nvarchar(max),sisg.Id), 'etl', 'etl'
	from
		OEGSystemStaging.dbo.ItemSwatchGroups sisg 
		join OEGSystemStaging.dbo.Products sp on sp.ItemId = sisg.ItemId
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		join Product p on p.ERPNumber = sp.Number
		join StyleClass styles on styles.[Name] = sp.Number 
	where 
		sp.BrandId = @brand
		and not exists (select Id from StyleTrait where [StyleClassId] = styles.Id and [Description] = convert(nvarchar(max),sisg.Id))

	insert into StyleTraitValue
	([StyleTraitId], [Description] , [SortOrder], [IsDefault], [Value], CreatedBy, ModifiedBy)
	select 
		trait.Id, convert(nvarchar(max),sis.SwatchId), sis.WebSortOrder, 0, sis.[Name], 'etl', 'etl'--, sis.GroupId
	from
		OEGSystemStaging.dbo.ItemSwatches sis 
		join OEGSystemStaging.dbo.ItemSwatchGroups sisg on sisg.Id = sis.GroupId
		join StyleTrait trait on trait.[Description] = convert(nvarchar(max),sisg.Id)
	where 
		isnull(sis.[Name],'') != ''
		and not exists (select Id from StyleTraitValue where [StyleTraitId] = trait.Id and [Description] = convert(nvarchar(max),sis.SwatchId))

	insert into StyleTraitValueProduct
	(StyleTraitValueId,ProductId)
	select
		traitValue.Id, p.Id
	from
		OEGSystemStaging.dbo.ItemSKUsSwatches siskus
		join OEGSystemStaging.dbo.ItemSwatches sis on sis.SwatchId = siskus.SwatchId
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ItemSKUId = siskus.ItemSKUId
		join OEGSystemStaging.dbo.Products sp on sp.ProductId = spsku.ProductId
		join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
		join StyleTraitValue traitValue on traitValue.[Description] = convert(nvarchar(max),sis.SwatchId)
	where
		sp.BrandId = @brand
		and not exists (select [StyleTraitValueId] from StyleTraitValueProduct where StyleTraitValueId = traitValue.Id and ProductId = p.Id)


/*

exec ETLProduct_FromOEG
select styleclassid,vendorid,* from product
select * from styleclass
select * from styletrait

--delete from product where createdby = 'etl'
--delete from StyleTraitValueProduct 
--delete from StyleTraitValue where createdby = 'etl'
--delete from StyleTrait where createdby = 'etl'
--delete from StyleClass where createdby = 'etl'

*/

end