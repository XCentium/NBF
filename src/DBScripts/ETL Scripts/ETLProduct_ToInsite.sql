IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProduct_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProduct_ToInsite
GO

create procedure ETLProduct_ToInsite 
as
begin
	

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

	insert into [Insite.NBF].dbo.Product
	(
		[Id],[Name],[ShortDescription],[ERPDescription],[UnitOfMeasure],[Sku],[ActivateOn],[DeactivateOn],
		[ShippingWeight],[ShippingLength],[ShippingWidth],[ShippingHeight],
		[QtyPerShippingPackage],[UrlSegment],[ContentManagerId],[ERPNumber],[UPCCode],
		[StyleClassId],[StyleParentId],[IsDiscontinued],[ManufacturerItem],[Unspsc],[UnitOfMeasureDescription],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	)
	select 
		[Id],[Name],[ShortDescription],[ERPDescription],[UnitOfMeasure],[Sku],[ActivateOn],[DeactivateOn],
		[ShippingWeight],[ShippingLength],[ShippingWidth],[ShippingHeight],
		[QtyPerShippingPackage],[UrlSegment],[ContentManagerId],[ERPNumber],[UPCCode],
		[StyleClassId],[StyleParentId],[IsDiscontinued],[ManufacturerItem],[Unspsc],[UnitOfMeasureDescription],
		[CreatedOn],[CreatedBy],[ModifiedOn],[ModifiedBy]
	from
		Product etl
	where
		not exists (select Id from [Insite.NBF].dbo.Product where Id = etl.Id)


	insert into [Insite.NBF].dbo.ContentManager
	(Id, [Name], CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, [Name], CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from ContentManager etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.ContentManager)

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
	where 
		not exists (select Id from [Insite.NBF].dbo.StyleTrait where Id = etl.Id)

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
	where 
		not exists (select Id from [Insite.NBF].dbo.StyleTraitValue where Id = etl.Id)
		
	insert into [Insite.NBF].dbo.StyleTraitValueProduct
	(
		[StyleTraitValueId],[ProductId]
	)
	select
		[StyleTraitValueId],[ProductId]
	from
		StyleTraitValueProduct etl
	where 
		not exists (select [StyleTraitValueId] from [Insite.NBF].dbo.StyleTraitValueProduct 
		where [StyleTraitValueId] = etl.[StyleTraitValueId] and [ProductId] = etl.[ProductId])

/*

ETLProduct_ToInsite

*/

end
