IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLCategory_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLCategory_FromOEG
GO

create procedure ETLCategory_FromOEG 
as
begin


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

	insert into Category 
	(WebSiteId, [Name], ShortDescription, UrlSegment, 
	ContentManagerId, CreatedBy, ModifiedBy)	
	select 
		@WebSiteId, convert(nvarchar(max), sic.ClassId), sic.[Name],
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')+'-'+convert(nvarchar(max), sic.ClassId)))),'/','-')),
		newid(),'etl','etl'
	from 
		OEGSystemStaging.dbo.LookupItemClasses sic
	where 
		sic.[Name] not in ('Bedroom Furniture', 'Entertainment/AV', 'Misc.', 'Parts')
		and not exists (select [Name] from Category where [Name] = convert(nvarchar(max), sic.ClassId))

	update Category set
		ShortDescription = sic.[Name],
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')+'-'+convert(nvarchar(max), sic.ClassId)))),'/','-')),
		ModifiedOn = SYSDATETIMEOFFSET()
	from 
		OEGSystemStaging.dbo.LookupItemClasses sic
		join Category c on c.[Name] = convert(nvarchar(max), sic.ClassId)
	where 
		ShortDescription != sic.[Name]


	insert into Category 
	(WebSiteId, ParentId, [Name], ShortDescription, UrlSegment, 
	ContentManagerId, CreatedBy, ModifiedBy)	
	select 
		@WebSiteId, c.Id, c.[Name] + '-' + convert(nvarchar(max), swc.Id), swc.DisplayName,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')+'-'+isnull(swc.DisplayName,'')+'-'+convert(nvarchar(max), swc.Id)))),'/','-')),
		newid(),'etl','etl'
	from 
		OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
		cross join Category c
		join OEGSystemStaging.dbo.LookupItemClasses sic on convert(nvarchar(max), sic.ClassId) = c.[Name]
	where
		BrandId = @brand
		and not exists (select [Name] from Category where [Name] = c.[Name] + '-' + convert(nvarchar(max), swc.Id))

	update Category set
		ShortDescription = swc.DisplayName,
		UrlSegment = LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(sic.[Name],'')+'-'+isnull(swc.DisplayName,'')+'-'+convert(nvarchar(max), swc.Id)))),'/','-')),
		ModifiedOn = SYSDATETIMEOFFSET()
	from 
		OEGSystemStaging.dbo.ItemWebCategoryDisplayNames swc
		cross join OEGSystemStaging.dbo.LookupItemClasses sic
		join Category c  on c.[Name] = convert(nvarchar(max), sic.ClassId) + '-' + convert(nvarchar(max), swc.Id)
	where 
		ShortDescription != swc.DisplayName

/*

exec ETLCategory_FromOEG
select * from category
--delete from category

*/
end
