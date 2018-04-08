
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductImage_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductImage_FromOEG
GO

create procedure ETLProductImage_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1
	
	truncate table ProductImage 

	-- for base products we have a nice query that orders the images appropriately with the 
	-- main image on sort position 1
	;with helper as
	(
	select 
		--p.ERPNumber, sp.ProductId, sp.BrandId, spwi.IsPrimary, spwi.WebSortOrder, --debugging
		ROW_NUMBER() OVER (partition by p.Id order by p.ERPNumber, spwi.IsPrimary desc, spwi.WebSortOrder) RowNumber, 
		p.Id, isnull(spwi.[FileName],'') [Name],
		isnull(spwi.[FileName],'') [SmallImagePath],
		isnull(spwi.[FileName],'') [MediumImagePath],
		isnull(spwi.[FileName],'') [LargeImagePath],
		isnull(spwi.Caption,'') [AltText]
	from
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductWebImages spwi on spwi.ProductId = sp.ProductId
			and (spwi.UsageId = 1 or spwi.IsPrimary = 1)
		join Product p on p.ERPNumber = sp.Number
	where 
		sp.BrandId = @brand
		--and p.Id = '29d946ba-87fd-e711-a98c-a3e0f1200094'
	--order by p.ERPNumber, spwi.IsPrimary desc, spwi.WebSortOrder -- debugging
	)
	insert into ProductImage 
	([ProductId], [Name],
	[SmallImagePath], 
	[MediumImagePath],
	[LargeImagePath],
	[AltText], 
	[SortOrder],
	[CreatedBy], [ModifiedBy]
	)
	select 
		h.Id, h.[Name],
		h.SmallImagePath,
		h.MediumImagePath,
		h.LargeImagePath,
		h.AltText, 
		h.RowNumber SortOrder,
		'etl','etl'
	from
		helper h
	order by h.Id, h.RowNumber	

	-- for variants we copy all images except for the main image, which we do last (so where rownumber != 1)
	;with helper as
	(
	select 
		--p.ERPNumber, sp.ProductId, sp.BrandId, spwi.IsPrimary, spwi.WebSortOrder, --debugging
		ROW_NUMBER() OVER (partition by p.Id order by p.ERPNumber, spwi.IsPrimary desc, spwi.WebSortOrder) RowNumber, 
		p.Id, isnull(spwi.[FileName],'') [Name],
		isnull(spwi.[FileName],'') [SmallImagePath],
		isnull(spwi.[FileName],'') [MediumImagePath],
		isnull(spwi.[FileName],'') [LargeImagePath],
		isnull(spwi.Caption,'') [AltText]
	from
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductWebImages spwi on spwi.ProductId = sp.ProductId
			and (spwi.UsageId = 1 or spwi.IsPrimary = 1)
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
			and spsku.EffStartDate < getdate() and spsku.effenddate > getdate() and spsku.IsWebEnabled = 1
		join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
	where 
		sp.BrandId = @brand
		--and p.ERPNumber like '56289%' 
	--order by p.ERPNumber, spwi.IsPrimary desc, spwi.WebSortOrder -- debugging
	)
	insert into ProductImage 
	([ProductId], [Name],
	[SmallImagePath], 
	[MediumImagePath],
	[LargeImagePath],
	[AltText], 
	[SortOrder],
	[CreatedBy], [ModifiedBy]
	)
	select 
		h.Id, h.[Name],
		h.SmallImagePath,
		h.MediumImagePath,
		h.LargeImagePath,
		h.AltText, 
		h.RowNumber SortOrder,
		'etl','etl'
	from
		helper h
	where 
		h.RowNumber != 1
	order by h.Id, h.RowNumber	


	-- again for variants, but this time we only want to get the main image (SortOrder = 1)
	;with helper as
	(
	select 
		--p.ERPNumber, p.ShortDescription, sp.ProductId, sp.BrandId, --debugging
		--spwi.*,
		ROW_NUMBER() OVER (partition by p.Id order by p.ERPNumber, spwi.IsPrimary desc, spwi.WebSortOrder) RowNumber, 
		p.Id, isnull(spwi.[FileName],'') [Name],
		isnull(spwi.[FileName],'') [SmallImagePath],
		isnull(spwi.[FileName],'') [MediumImagePath],
		isnull(spwi.[FileName],'') [LargeImagePath],
		isnull(spwi.Caption,'') [AltText]
	from
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductWebImages spwi on spwi.ProductId = sp.ProductId
			and ((spwi.UsageId = 2 and spwi.IsPrimary = 0) or spwi.IsPrimary = 1) -- these are the featured images
		join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
			and spsku.EffStartDate < getdate() and spsku.effenddate > getdate() and spsku.IsWebEnabled = 1
		left join OEGSystemStaging.dbo.ProductSkusWebImages spswi on spswi.ProductSKUId = spsku.ProductSKUId
		join Product p on p.ERPNumber = sp.Number + '_' + spsku.OptionCode
	where 
		sp.BrandId = @brand
		and (spswi.WebImageId = spwi.WebImageId or spswi.WebImageId is null)
		--and p.ERPNumber = '41899_11' 
		--and p.Id = '232286bf-87fd-e711-a98c-a3e0f1200094'
	--order by p.ERPNumber -- debugging
	)
	insert into ProductImage 
	([ProductId], [Name],
	[SmallImagePath], 
	[MediumImagePath],
	[LargeImagePath],
	[AltText], 
	[SortOrder],
	[CreatedBy], [ModifiedBy]
	)
	select 
		h.Id, h.[Name],
		h.SmallImagePath,
		h.MediumImagePath,
		h.LargeImagePath,
		h.AltText, 
		h.RowNumber SortOrder,
		'etl','etl'
	from
		helper h
	where
		h.RowNumber = 1
	order by h.Id, h.RowNumber	




--  insert swatch images

	insert into ProductImage 
	([ProductId], [Name],
	[SmallImagePath], 
	[MediumImagePath],
	[LargeImagePath],
	[AltText], 
	[SortOrder],
	[CreatedBy], [ModifiedBy]
	)
	select p.id, isnull(sis.WebPath,'') [Name],
	isnull(sis.WebPath,'') [SmallImagePath],
	isnull(sis.WebPath,'') [MediumImagePath],
	isnull(sis.WebPath,'') [LargeImagePath],
	p.Name [AltText],
	1 [SortOrder],
	'etl','etl'
	from 
		Product p 
		join OEGSystemStaging.dbo.ItemSwatches sis on convert(nvarchar(max),sis.SwatchId) = RIGHT(p.ERPNumber,CHARINDEX(':',REVERSE(p.ERPNumber))-1) 
	where
		p.ContentManagerId = '00000000-0000-0000-0000-000000000000'
		and isnull(sis.WebPath,'') != ''
		and not exists (select Id from ProductImage where ProductId = p.Id)

/*
exec ETLProductImage_FromOEG
select * from ProductImage

*/

end


