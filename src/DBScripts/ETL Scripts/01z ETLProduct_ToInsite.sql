IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProduct_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProduct_ToInsite
GO

create procedure ETLProduct_ToInsite 
as
begin
	
	-- load style class records (root of product that has styles)
	insert into [Insite.NBF].dbo.StyleClass
	(
		[Id],[Name],[Description],[IsActive],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	)
	select
		[Id],[Name],[Description],[IsActive],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	from
		StyleClass etl
	where 
		not exists (select Id from [Insite.NBF].dbo.StyleClass where Id = etl.Id)

	-- insert new products
	insert into [Insite.NBF].dbo.Product
	(
		[Id],[Name],[ShortDescription],[ERPDescription],[UnitOfMeasure],[Sku],[ActivateOn],[DeactivateOn],
		[ShippingWeight],[ShippingLength],[ShippingWidth],[ShippingHeight],
		[QtyPerShippingPackage],[ShippingAmountOverride],[UrlSegment],[ContentManagerId],[ERPNumber],[UPCCode],
		[StyleClassId],[StyleParentId],[IsDiscontinued],[ManufacturerItem],[Unspsc],[UnitOfMeasureDescription],[VendorId],
		[ModelNumber], [ProductCode], [PackDescription],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	)
	select 
		[Id],[Name],[ShortDescription],[ERPDescription],[UnitOfMeasure],[Sku],[ActivateOn],[DeactivateOn],
		[ShippingWeight],[ShippingLength],[ShippingWidth],[ShippingHeight],
		[QtyPerShippingPackage],[ShippingAmountOverride],[UrlSegment],[ContentManagerId],[ERPNumber],[UPCCode],
		[StyleClassId],[StyleParentId],[IsDiscontinued],[ManufacturerItem],[Unspsc],[UnitOfMeasureDescription],[VendorId],
		[ModelNumber], [ProductCode], [PackDescription],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	from
		Product etl
	where
		not exists (select Id from [Insite.NBF].dbo.Product where Id = etl.Id)


	-- load specifications
	insert into [Insite.NBF].dbo.Specification
	(Id, ContentManagerId, [Name], [Description], IsActive, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy, ProductId)
	select Id, ContentManagerId, [Name], [Description], IsActive, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy, ProductId
	from Specification etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.Specification)

	-- load content manager
	insert into [Insite.NBF].dbo.ContentManager
	(Id, [Name], CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, [Name], CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from ContentManager etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.ContentManager)

	-- update any product base data
	update [Insite.NBF].dbo.Product  set
	
		[ShortDescription] = etl.[ShortDescription],
		ERPDescription = etl.ERPDescription,
		UnitOfMeasure = etl.UnitOfMeasure,
		Sku = etl.Sku,
		ActivateOn = etl.ActivateOn,
		DeactivateOn = etl.DeactivateOn,
		TaxCode1 = etl.TaxCode1,
		ShippingWeight = etl.ShippingWeight,
		ShippingLength = etl.ShippingLength,
		ShippingWidth = etl.ShippingWidth,
		ShippingHeight = etl.ShippingHeight,
		[QtyPerShippingPackage] = etl.[QtyPerShippingPackage],
		[ShippingAmountOverride] = etl.[ShippingAmountOverride],
		[UrlSegment] = etl.[UrlSegment],
		[ContentManagerId] =etl.[ContentManagerId],
		[ERPNumber] = etl.[ERPNumber],
		UPCCode = etl.UPCCode,
		[StyleClassId] = etl.[StyleClassId],
		[StyleParentId] = etl.[StyleParentId],
		[IsDiscontinued] = etl.[IsDiscontinued],
		[ManufacturerItem] = etl.[ManufacturerItem],
		[ModelNumber] = etl.[ModelNumber],
		[ProductCode] = etl.[ProductCode],
		[PackDescription] = etl.[PackDescription],
		[Unspsc] = etl.[Unspsc],
		[UnitOfMeasureDescription] = etl.[UnitOfMeasureDescription],
		VendorId = etl.VendorId,
		CreatedOn = etl.CreatedOn,
		CreatedBy = etl.CreatedBy,
		ModifiedBy = etl.ModifiedBy,
		ModifiedOn = etl.ModifiedOn

	from Product etl
	join [Insite.NBF].dbo.Product p on p.Id = etl.Id

	-- load content

	--updates
	update [Insite.NBF].dbo.Content set
		Html = etl.Html,
		CreatedBy = etl.CreatedBy,
		CreatedOn = etl.CreatedOn,
		ModifiedOn = etl.ModifiedOn,
		ModifiedBy = etl.ModifiedBy
	from Content etl
	join [Insite.NBF].dbo.Content c on c.Id = etl.Id
	where c.Html != etl.Html

	--new
	insert into [Insite.NBF].dbo.Content 
	(Id, ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from Content etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.Content)

	-- these tables have no dependencies and can be wiped and created with new guids every time
	truncate table [Insite.NBF].dbo.StyleTraitValueProduct
	delete from [Insite.NBF].dbo.StyleTraitValue
	delete from [Insite.NBF].dbo.StyleTrait

	insert into [Insite.NBF].dbo.StyleTrait
	(
		[Id],[StyleClassId],[Name],[UnselectedValue],[SortOrder],[Description],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	)
	select
		[Id],[StyleClassId],[Name],[UnselectedValue],[SortOrder],[Description],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	from
		StyleTrait etl

	insert into [Insite.NBF].dbo.StyleTraitValue
	(
		[Id],[StyleTraitId],[Value],[SortOrder],[IsDefault],[Description],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	)
	select
		[Id],[StyleTraitId],[Value],[SortOrder],[IsDefault],[Description],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	from
		StyleTraitValue etl


	insert into [Insite.NBF].dbo.StyleTraitValueProduct
	(
		[StyleTraitValueId],[ProductId]
	)
	select
		[StyleTraitValueId],[ProductId]
	from
		StyleTraitValueProduct etl

/*

ETLProduct_ToInsite

*/

end
