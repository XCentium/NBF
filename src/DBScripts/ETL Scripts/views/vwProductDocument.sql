IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwProductDocument') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwProductDocument]
GO


CREATE VIEW [dbo].[vwProductDocument]
AS


SELECT 
	pd.Id,
	pd.[Name],
	pd.[Description],
	pd.[FilePath],
	pd.[DocumentType],
	pd.[LanguageId],
	pd.[ParentId],
	pd.[ParentTable],
	p.ERPNumber,
	l.LanguageCode
FROM
	dbo.Document pd
	join Product p on p.Id = pd.ParentId
		and pd.ParentTable = 'product'
	join Language l on l.Id = pd.LanguageId
--where

/*
select * from vwProductDocument
*/
GO