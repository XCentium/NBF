IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLCategoryProduct_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLCategoryProduct_FromOEG
GO

create procedure ETLCategoryProduct_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1

	-- this ties a product to a category

	insert into CategoryProduct
	(CategoryId, ProductId, CreatedBy, ModifiedBy)
	select 
		c.Id, p.Id, 'etl', 'etl'--, p.ShortDescription, sic.[Name], swc.DisplayName
	from
		OEGSystemStaging.dbo.Items si
		join OEGSystemStaging.dbo.Products sp on sp.ItemId = si.ItemId
			and sp.BrandId = @brand
		join OEGSystemStaging.dbo.LookupItemClasses sic on sic.ClassId = si.ClassId
			and sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Misc.', 'Parts')
		join OEGSystemStaging.dbo.ItemsWebCategories siwc on siwc.ItemId = si.ItemId 
		join OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc on swc.WebCategoryId = siwc.WebCategoryId
			and swc.BrandId = @brand
		join Product p on p.ERPNumber = sp.Number
		join Category c on c.[Name] = convert(nvarchar(max), sic.ClassId) + '-' + convert(nvarchar(max), swc.Id)

	where
		not exists (select Id from CategoryProduct where CategoryId = c.Id and ProductId = p.Id)

	-- because parents and children are reversible, we have to do this twice (in reverse)

	insert into CategoryProduct
	(CategoryId, ProductId, CreatedBy, ModifiedBy)
	select 
		c.Id, p.Id, 'etl', 'etl'--, p.ShortDescription, sic.[Name], swc.DisplayName
	from
		OEGSystemStaging.dbo.Items si
		join OEGSystemStaging.dbo.Products sp on sp.ItemId = si.ItemId
			and sp.BrandId = @brand
		join OEGSystemStaging.dbo.LookupItemClasses sic on sic.ClassId = si.ClassId
			and sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Misc.', 'Parts')
		join OEGSystemStaging.dbo.ItemsWebCategories siwc on siwc.ItemId = si.ItemId 
		join OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc on swc.WebCategoryId = siwc.WebCategoryId
			and swc.BrandId = @brand
		join Product p on p.ERPNumber = sp.Number
		join Category c on c.[Name] = convert(nvarchar(max), swc.Id) + '-' + convert(nvarchar(max), sic.ClassId)

	where
		not exists (select Id from CategoryProduct where CategoryId = c.Id and ProductId = p.Id)
/*
exec ETLCategoryProduct_FromOEG
select * from category where id = '9800EE99-2BFB-E711-A98C-A3E0F1200094'
*/

end