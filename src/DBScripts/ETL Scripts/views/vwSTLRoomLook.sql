IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwSTLRoomLook') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwSTLRoomLook
GO


CREATE VIEW [dbo].[vwSTLRoomLook]
AS


	SELECT 
		s.Status,
		s.Title,
		s.Description,
		s.MainImage,
		isnull(s.SortOrder,0) SortOrder

	FROM
		OEGSystemStaging.dbo.STLRoomLooks s

/*
select * from vwSTLRoomLook 
select * from OEGSystemStaging.dbo.STLRoomLooks
*/

GO