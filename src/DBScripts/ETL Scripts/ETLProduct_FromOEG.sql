IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProduct_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProduct_FromOEG
GO

create procedure ETLProduct_FromOEG 
as
begin

	declare @brand int
	set @brand = 1

	--base product styles per website
	
	insert into StyleClass
	([Name],[Description],[IsActive],CreatedBy,ModifiedBy)
	select  
		sp.ProductId [Name],
		convert(nvarchar(max), sp.ProductId) + ' variants' [Description],
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
		and convert(nvarchar(max),sp.ProductId) not in (select [Name] from StyleClass)

	--base product info per website

	insert into Product 
	(ERPNumber, [Name], ERPDescription, ShortDescription,  UrlSegment, ContentManagerId, StyleClassId)
	select  
		sp.ProductId ERPNumber,
		sp.Number [Name],
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
		join StyleClass styles on styles.[Name] = convert(nvarchar(max),sp.ProductId)
	where 
		sp.BrandId = @brand
		and convert(nvarchar(max),sp.ProductId) not in (select ERPNumber from Product)
	

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
		join Product p on p.ERPNumber = convert(nvarchar(max),sp.ProductId)
	where 
		sp.BrandId = @brand

		
	--variant product info per website

	insert into Product 
	(ERPNumber, [Name], ERPDescription, ShortDescription,  UrlSegment, ContentManagerId)
	select  
		convert(nvarchar(max), sp.ProductId) + '-' + convert(nvarchar(max), spsku.ProductSKUId) ERPNumber,
		'',
		ltrim(rtrim(isnull(sisku.[Description],''))) ERPDescription,
		ltrim(rtrim(isnull(spsku.[Description],''))) ShortDescription,
		convert(nvarchar(max), sp.ProductId) + '-' + convert(nvarchar(max), spsku.ProductSKUId) UrlSegment,
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
		and convert(nvarchar(max), sp.ProductId) + '-' + convert(nvarchar(max), spsku.ProductSKUId) not in (select ERPNumber from Product)


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
		UrlSegment = convert(nvarchar(max), sp.ProductId) + '-' + convert(nvarchar(max), spsku.ProductSKUId),
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
		join Product p on p.ERPNumber = convert(nvarchar(max), sp.ProductId) + '-' + convert(nvarchar(max), spsku.ProductSKUId)
	where 
		sp.BrandId = @brand

	-- tie up the style parent for each of the variants
	;with parentProduct as
	(
	select 
		p.Id, p.ERPNumber
	from 
		Product p
	where
		p.ERPNumber not like '%-%'
	)
	update Product 
	set StyleParentId = pp.Id
	from Product p
	join parentProduct pp on pp.ERPNumber = rtrim(left(p.ERPNumber, CHARINDEX('-', p.ERPNumber) - 1))
	where 
		p.ERPNumber like '%-%'

/*
	insert into StyleTrait
	([StyleClassId], [Name], [SortOrder], [Description], CreatedBy, ModifiedBy)
	select 
		styles.Id, sisg.[Name], sisg.WebSortOrder, convert(nvarchar(max),sisg.Id), 'etl', 'etl'
	from
		OEGSystemStaging.dbo.ItemSwatchGroups sisg 
		join OEGSystemStaging.dbo.Products sp on sp.ItemId = sisg.ItemId
		join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		join Product p on p.ERPNumber = convert(nvarchar(max),sp.ProductId)
		join StyleClass styles on styles.[Name] = convert(nvarchar(max),sp.ProductId) 
	where 
		sp.BrandId = 1 --todo @brand
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
		and sis.EffectiveDateStart is not null -- todo: ?????
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
		join Product p on p.ERPNumber = convert(nvarchar(max), sp.ProductId) + '-' + convert(nvarchar(max), spsku.ProductSKUId)
		join StyleTraitValue traitValue on traitValue.[Description] = convert(nvarchar(max),sis.SwatchId)
	where
		not exists (select [StyleTraitValueId] from StyleTraitValueProduct where StyleTraitValueId = traitValue.Id and ProductId = p.Id)
*/

/*

exec ETLProduct_FromOEG
select styleclassid,* from product
select * from styleclass
select * from styletrait

--delete from product where createdby = 'etl'
--delete from StyleTraitValueProduct 
--delete from StyleTraitValue where createdby = 'etl'
--delete from StyleTrait where createdby = 'etl'
--delete from StyleClass where createdby = 'etl'

*/

end
