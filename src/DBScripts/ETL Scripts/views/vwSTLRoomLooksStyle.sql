IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwSTLRoomLooksStyle') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwSTLRoomLooksStyle
GO


CREATE VIEW [dbo].vwSTLRoomLooksStyle
AS


	SELECT 
		rl.Title STLRoomLookTitle,
		slus.Name StyleName,
		isnull(s.SortOrder,0) SortOrder
	FROM
		OEGSystemStaging.dbo.STLRoomLooksStyles s
		join OEGSystemStaging.dbo.STLRoomLooks rl on rl.STLRoomLookID = s.STLRoomLookID
		join OEGSystemStaging.dbo.LookupItemStyles slus on slus.StyleId = s.StyleId

/*
select * from vwSTLRoomLooksStyle 
select * from OEGSystemStaging.dbo.STLRoomLooksStyles
select * from OEGSystemStaging.dbo.STLCategories
select * from OEGSystemStaging.dbo.LookupItemStyles
*/

GO