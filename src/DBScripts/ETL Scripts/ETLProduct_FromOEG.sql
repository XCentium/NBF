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
		join StyleClass styles on styles.[Name] = sp.ProductId
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
		DeactivateOn = case when luStatus.Name = 'Active' then null else getdate()-1 end,
		CreatedOn = sp.CreatedDate,
		CreatedBy = isnull(sp.CreatedBy,'etl'),
		ModifiedOn = sp.ModifiedDate,
		ModifiedBy = isnull(sp.ModifiedBy, 'etl')
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
		IsDiscontinued = case when spsku.EffEndDate > getdate() then 0 else 1 end,
		ActivateOn = spsku.EffStartDate,
		DeactivateOn = spsku.EffEndDate,
		UPCCode = isnull(sisku.UPCCode,''),
		ManufacturerItem = spsku.OptionCode,
		CreatedOn = spsku.CreatedDate,
		CreatedBy = isnull(spsku.CreatedBy,'etl'),
		ModifiedOn = spsku.ModifiedDate,
		ModifiedBy = isnull(spsku.ModifiedBy, 'etl')
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


/*

exec ETLProduct_FromOEG
select styleclassid,* from product
select * from styleclass
--delete from product
--delete from styleclass

*/

end
