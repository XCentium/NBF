IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductRichDescription_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductRichDescription_ToInsite
GO

create procedure ETLProductRichDescription_ToInsite 
as
begin


	-- we can delete the old descriptions every night and reload from fresh data

	delete [Insite.NBF].dbo.Content 
	from [Insite.NBF].dbo.Content ct
		join product p on p.ContentManagerId = ct.ContentManagerId
	
	--new
	insert into [Insite.NBF].dbo.Content 
	(Id, ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from Content etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.Content)

/*
exec ETLProductRichDescription_ToInsite
*/
end
