IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwSTLCategory') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwSTLCategory
GO


CREATE VIEW [dbo].[vwSTLCategory]
AS


	SELECT 
		s.Status,
		s.Name,
		s.Description,
		s.MainImage,
		isnull(s.SortOrder,0) SortOrder

	FROM
		OEGSystemStaging.dbo.STLCategories s

/*
select * from vwSTLCategory 
select * from OEGSystemStaging.dbo.STLCategories
*/

GO