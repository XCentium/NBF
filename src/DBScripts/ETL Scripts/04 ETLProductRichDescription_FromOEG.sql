IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductRichDescription_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductRichDescription_FromOEG
GO


CREATE procedure [dbo].ETLProductRichDescription_FromOEG 
as
begin

	-- copy dependency tables
	insert into RuleType
	select * from [Insite.NBF].dbo.RuleType
	where id not in (select id from RuleType)

	insert into RuleManager
	select * from [Insite.NBF].dbo.RuleManager
	where id not in (select id from RuleManager)

	insert into Language
	select * from [Insite.NBF].dbo.[Language]
	where Id not in (select Id from Language)


	insert into Persona
	select * from [Insite.NBF].dbo.Persona
	where Id not in (select Id from Persona)

	declare @LanguageId uniqueidentifier
	select top 1 @LanguageId = l.Id from [Language] l where LanguageCode = 'en-us'

	declare @PersonaId uniqueidentifier
	select top 1 @PersonaId = p.Id from Persona p where [Name] = 'Default'

	-- replace from source always
	delete Content 
	from Content ct
		join product p on p.ContentManagerId = ct.ContentManagerId
		join OEGSystemStaging.dbo.Products sp on convert(nvarchar(max),sp.ProductId) = p.ERPNumber

	insert into Content 
	(ContentManagerId, [Name], 
	Html, 
	Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)

	select p.ContentManagerId, 'New Revision', 
	isnull(spwd2.[Description], '<p></p>') + '<br><br>' + isnull(spwd3.[Description], '<p></p>') + '<br><br>' + isnull(spwd4.[Description], '<p></p>'), 
	1, @LanguageId, @PersonaId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET(), 'Desktop', 'etl', 'etl' 
	from 
		product p
		join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		left join OEGSystemStaging.dbo.ProductsWebDescriptions spwd2 on spwd2.ProductId = sp.ProductId
			and spwd2.TypeId = 2
		left join OEGSystemStaging.dbo.ProductsWebDescriptions spwd3 on spwd3.ProductId = sp.ProductId
			and spwd3.TypeId = 3
		left join OEGSystemStaging.dbo.ProductsWebDescriptions spwd4 on spwd4.ProductId = sp.ProductId
			and spwd4.TypeId = 4
	where 
		p.ContentManagerId not in (select ContentManagerId from Content)



/*

exec ETLProductRichDescription_FromOEG
select * from content where html like '%Tablet Arm Chair features Virco''s classic polyethylene stack chair%'

*/
end


