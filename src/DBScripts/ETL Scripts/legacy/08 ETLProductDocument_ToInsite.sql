
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductDocument_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductDocument_ToInsite
GO

create procedure ETLProductDocument_ToInsite  

as
begin

	-- replace all documents

	truncate table [Insite.NBF].dbo.Document

	insert into [Insite.NBF].dbo.Document 
	(
		[Id], [Name], [Description], [CreatedOn], [FilePath], [DocumentType], [LanguageId], 
		[CreatedBy], [ModifiedOn], [ModifiedBy], [ParentId], [ParentTable]
	)
	select 
		[Id], [Name], [Description], [CreatedOn], [FilePath], [DocumentType], [LanguageId], 
		[CreatedBy], [ModifiedOn], [ModifiedBy], [ParentId], [ParentTable]
	from Document etl

/*

exec ETLProductDocument_ToInsite

*/

end
