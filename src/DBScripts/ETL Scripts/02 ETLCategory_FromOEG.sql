IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLCategory_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLCategory_FromOEG
GO

create procedure ETLCategory_FromOEG 
as
begin


	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1

	-- copy down dependent tables from insite
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


	-- level one categories
	insert into Category 
	(WebSiteId, [Name], ShortDescription, UrlSegment, 
	ContentManagerId, CreatedBy, ModifiedBy)	
	select 
		@WebSiteId, convert(nvarchar(max), sic.ClassId), sic.[Name],
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')))),'/','-')),
		newid(),'etl','etl'
	from 
		OEGSystemStaging.dbo.LookupItemClasses sic
	where 
		sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Parts')
		and not exists (select [Name] from Category where [Name] = convert(nvarchar(max), sic.ClassId))

	update Category set
		ShortDescription = sic.[Name],
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')))),'/','-')),
		ModifiedOn = SYSDATETIMEOFFSET()
	from 
		OEGSystemStaging.dbo.LookupItemClasses sic
		join Category c on c.[Name] = convert(nvarchar(max), sic.ClassId)

	-- level two
	insert into Category 
	(WebSiteId, ParentId, [Name], ShortDescription, UrlSegment, 
	ContentManagerId, CreatedBy, ModifiedBy)	
	select 
		@WebSiteId, c.Id, c.[Name] + '-' + convert(nvarchar(max), swc.Id), swc.DisplayName,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')+'-'+isnull(swc.DisplayName,'')))),'/','-')),
		newid(),'etl','etl'
	from 
		OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
		cross join Category c
		join OEGSystemStaging.dbo.LookupItemClasses sic on convert(nvarchar(max), sic.ClassId) = c.[Name]
	where
		swc.BrandId = @brand
		and not exists (select [Name] from Category where [Name] = c.[Name] + '-' + convert(nvarchar(max), swc.Id))

	update Category set
		ShortDescription = swc.DisplayName,
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')+'-'+isnull(swc.DisplayName,'')))),'/','-')),
		ModifiedOn = SYSDATETIMEOFFSET()
	from 
		OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
		cross join OEGSystemStaging.dbo.LookupItemClasses sic
		join Category c on c.[Name] = convert(nvarchar(max), sic.ClassId) + '-' + convert(nvarchar(max), swc.Id)


	-- NOW, reverse it - every child is now a parent and every parent is now a child

	-- level one
	insert into Category 
	(WebSiteId, [Name], ShortDescription, UrlSegment, 
	ContentManagerId, CreatedBy, ModifiedBy)	
	select 
		@WebSiteId, convert(nvarchar(max), swc.Id), swc.DisplayName,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(swc.DisplayName,'')))),'/','-')),
		newid(),'etl','etl'
	from 
		OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
	where
		swc.BrandId = @brand
		and not exists (select [Name] from Category where [Name] = convert(nvarchar(max), swc.Id))
	
	update Category set
		ShortDescription = swc.DisplayName,
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(swc.DisplayName,'')))),'/','-')),
		ModifiedOn = SYSDATETIMEOFFSET()
	from
		OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
		join Category c on c.[Name] = convert(nvarchar(max), swc.Id)

	-- level 2
	insert into Category 
	(WebSiteId, ParentId, [Name], ShortDescription, UrlSegment, 
	ContentManagerId, CreatedBy, ModifiedBy)	
	select 
		@WebSiteId, c.Id, c.[Name] + '-' + convert(nvarchar(max), sic.ClassId), sic.[Name],
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(swc.DisplayName,'')+'-'+isnull(sic.[Name],'')))),'/','-')),
		newid(),'etl','etl'
	from 
		OEGSystemStaging.dbo.LookupItemClasses sic 
		cross join Category c
		join OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc on convert(nvarchar(max), swc.Id) = c.[Name]
	where
		sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Parts')
		and swc.BrandId = @brand
		and not exists (select [Name] from Category where [Name] = c.[Name] + '-' + convert(nvarchar(max), sic.ClassId))

	update Category set
		ShortDescription = sic.[Name],
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(swc.DisplayName,'')+'-'+isnull(sic.[Name],'')))),'/','-')),
		ModifiedOn = SYSDATETIMEOFFSET()
	from 
		OEGSystemStaging.dbo.LookupItemClasses sic 
		cross join OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
		join Category c on c.[Name] = convert(nvarchar(max), swc.Id) + '-' + convert(nvarchar(max), sic.ClassId)

	end

	-- trim last hyphen
	update Category set
		UrlSegment=LEFT(UrlSegment, LEN(UrlSegment)-1)
	where right(UrlSegment,1) = '-'


	insert into ContentManager
	(Id, [Name], CreatedBy, ModifiedBy)
	select ContentManagerId, 'Category', 'etl', 'etl'
	from Category
	where ContentManagerId not in (select Id from ContentManager)


	

/*

exec ETLCategory_FromOEG
select * from category 
--delete from category

*/
end
