IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLSwatchProducts_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLSwatchProducts_FromOEG
GO

create procedure ETLSwatchProducts_FromOEG 
as
begin


	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1

	insert into Theme
	select * from [Insite.NBF].dbo.Theme s
	where not exists (select Id from Theme where Id = s.Id)

	insert into WebSite
	select * from [Insite.NBF].dbo.WebSite s
	where not exists (select Id from WebSite where Id = s.Id)

	declare @WebSiteId uniqueidentifier
	select top 1 @WebSiteId = Id from WebSite where Name like '%_main%'

	declare @SwatchCategoryId uniqueidentifier

	if not exists (select Id from Category where [Name] = 'Swatches')
	begin
		set @SwatchCategoryId = newid()

		insert into Category 
			(Id, WebSiteId, [Name], ShortDescription, 
			UrlSegment, ContentManagerId, CreatedBy, ModifiedBy)	
		values 
			(@SwatchCategoryId, @WebSiteId, 'Swatches', 'Swatches',
			'swatches',	newid(),'etl','etl')
	end
	else
	begin
		select top 1 @SwatchCategoryId = Id from Category where [Name] = 'Swatches'
	end

	insert into Product 
	(
		ERPNumber, 
		[Name], ERPDescription, 
		ShortDescription, 
		ProductCode, ModelNumber, 
		UrlSegment, 
		ContentManagerId, CreatedBy, ModifiedBy
	)
	select  distinct
		p.ERPNumber + ':' + st.[Description] + ':' + stv.[Description] ERPNumber,
		stv.[Value] [Name], '' ERPDescription,
		p.ShortDescription + ' - ' + st.[Name] + ' - ' + stv.[Value]  ShortDescription,
		p.ERPNumber ProductCode, st.[Name] ModelNumber,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(p.ERPNumber + ':' + st.[Name] + ':' + stv.[Value],'')))),'/','-')) UrlSegment,
		'00000000-0000-0000-0000-000000000000' ContentManagerId, 'etl', 'etl'
	from 
		StyleTraitValueProduct stvp
		join StyleTraitValue stv on stv.Id = stvp.StyleTraitValueId
		join StyleTrait st on st.Id = stv.StyleTraitId
		join StyleClass sc on sc.Id = st.StyleClassId
		join Product p on p.StyleClassId = sc.Id
	where 
		not exists (select Id from Product where ERPNumber = p.ERPNumber + ':' + st.[Description] + ':' + stv.[Description])
		--and p.ERPNumber = '10066-1'
	order by
		p.ERPNumber, st.[Name], stv.[Value]


--select * from StyleTraitValue where Description = 232836
--select * from StyleTrait where id = '1B222AB4-E607-E811-A98C-A3E0F1200094'
--select * from StyleTrait where id = '1C222AB4-E607-E811-A98C-A3E0F1200094'
--select * from StyleClass where id = '3FE56EB9-87FD-E711-A98C-A3E0F1200094'
--select * from StyleClass where id = '82A672B9-87FD-E711-A98C-A3E0F1200094'

	insert into CategoryProduct
	(CategoryId, ProductId, CreatedBy, ModifiedBy)
	select 
		@SwatchCategoryId, p.Id, 'etl', 'etl'--, p.ShortDescription, sic.[Name], swc.DisplayName
	from
		product p
	where
		not exists (select Id from CategoryProduct where CategoryId = @SwatchCategoryId and ProductId = p.Id)
		and p.ContentManagerId = '00000000-0000-0000-0000-000000000000'

/*

exec ETLSwatchProducts_FromOEG
select * from product where createdon > '2018-02-07 06:05:25.0633333 +00:00' order by createdon desc
select * from category order by createdon desc
--delete from category

*/
end
