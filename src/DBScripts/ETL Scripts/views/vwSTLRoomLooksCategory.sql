IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwSTLRoomLooksCategory') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwSTLRoomLooksCategory
GO


CREATE VIEW [dbo].[vwSTLRoomLooksCategory]
AS


	SELECT 
		rl.Title STLRoomLookTitle,
		c.Name STLCategoryName,
		isnull(s.SortOrder,0) SortOrder
	FROM
		OEGSystemStaging.dbo.STLRoomLooksCategories s
		join OEGSystemStaging.dbo.STLRoomLooks rl on rl.STLRoomLookID = s.STLRoomLookID
		join OEGSystemStaging.dbo.STLCategories c on c.STLCategoryID = s.STLCategoryID

/*
select * from vwSTLRoomLooksCategory 
select * from OEGSystemStaging.dbo.STLRoomLooksCategories
select * from OEGSystemStaging.dbo.STLCategories
*/

GO