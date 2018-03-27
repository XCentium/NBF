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

	--insert into Theme
	--select * from [Insite.NBF].dbo.Theme s
	--where not exists (select Id from Theme where Id = s.Id)
	
	--insert into WebSite
	--select * from [Insite.NBF].dbo.WebSite s
	--where not exists (select Id from WebSite where Id = s.Id)

	declare @WebSiteId uniqueidentifier
	select top 1 @WebSiteId = Id from WebSite where Name like '%National Business Furniture%'

	if @WebSiteId is null
	begin
		select '@WebSiteId is null'
	end
	else
	begin

	declare @SwatchCategoryId uniqueidentifier

	-- create a swatches category if it doesn't exists
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

	-- reverse engineer the list of all styles in order to get the unique swatches 
	insert into Product 
	(
		ERPNumber, 
		[Name], 
		ShortDescription, 
		ProductCode, 
		ModelNumber, 
		UrlSegment, 
		ERPDescription,
		PackDescription,
		ContentManagerId, CreatedBy, ModifiedBy
	)
	select  distinct
		p.ERPNumber + ':' + st.[Description] + ':' + stv.[Description] ERPNumber,
		stv.[Value] [Name],
		p.ERPNumber + ' - ' + st.[Name] + ' - ' + stv.[Value]  ShortDescription,
		p.ERPNumber ProductCode, 
		st.[Name] ModelNumber,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(p.ERPNumber + ':' + st.[Name] + ':' + stv.[Value],'')))),'/','-')) UrlSegment,
		'', '',
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

	-- in case swatch group name or values are updated
	update Product set
		[Name] = stv.[Value],
		ShortDescription = p.ProductCode + ' - ' + st.[Name] + ' - ' + stv.[Value],
		ModelNumber = st.[Name],
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(p.ERPNumber + ':' + st.[Name] + ':' + stv.[Value],'')))),'/','-')),
		ERPDescription = '',
		PackDescription = ''
	from StyleTraitValue stv
		join StyleTrait st on st.Id = stv.StyleTraitId 
		join StyleClass sc on sc.Id = st.StyleClassId
		join Product p on p.ERPNumber = sc.[Name] + ':' + st.[Description] + ':' + stv.[Description]


	-- image info 
	update Product set
		ManufacturerItem = isnull(sis.WebPath,'')
	from 
		Product p 
		join OEGSystemStaging.dbo.ItemSwatches sis on convert(nvarchar(max),sis.SwatchId) = RIGHT(p.ERPNumber,CHARINDEX(':',REVERSE(p.ERPNumber))-1) 
	where
		p.ContentManagerId = '00000000-0000-0000-0000-000000000000'
		and not exists (select Id from ProductImage where ProductId = p.Id)

	-- associate every swatch product with the new swatch category
	insert into CategoryProduct
	(CategoryId, ProductId, CreatedBy, ModifiedBy)
	select 
		@SwatchCategoryId, p.Id, 'etl', 'etl'--, p.ShortDescription, sic.[Name], swc.DisplayName
	from
		product p
	where
		not exists (select Id from CategoryProduct where CategoryId = @SwatchCategoryId and ProductId = p.Id)
		and p.ContentManagerId = '00000000-0000-0000-0000-000000000000'


	end

/*

exec ETLSwatchProducts_FromOEG
62079 
*/
end
