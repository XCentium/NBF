IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLCategory_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLCategory_ToInsite
GO

create procedure ETLCategory_ToInsite 
as
begin
	

	--updates
	update [Insite.NBF].dbo.Category set
		ParentId = etl.ParentId,
		[Name] = etl.[Name],
		ShortDescription = etl.ShortDescription,
		UrlSegment = etl.UrlSegment,
		ContentManagerId = etl.ContentManagerId,
		CreatedBy = etl.CreatedBy,
		CreatedOn = etl.CreatedOn,
		ModifiedOn = etl.ModifiedOn,
		ModifiedBy = etl.ModifiedBy
	from Category etl
	join [Insite.NBF].dbo.Category c on c.Id = etl.Id

	--new
	insert into [Insite.NBF].dbo.Category
	(Id, ParentId, WebSiteId, Name, ShortDescription, ActivateOn, DeactivateOn, UrlSegment, SortOrder, ContentManagerId, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, ParentId, WebSiteId, Name, ShortDescription, ActivateOn, DeactivateOn, UrlSegment, SortOrder, ContentManagerId, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from Category etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.Category)

/*
exec ETLCategory_ToInsite
*/

end