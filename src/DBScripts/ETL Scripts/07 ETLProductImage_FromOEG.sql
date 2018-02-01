
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


/*
exec ETLProductImage_FromOEG
select * from ProductImage

*/

end


