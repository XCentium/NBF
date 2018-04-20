IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwSTLRoomLooksProduct') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwSTLRoomLooksProduct
GO


CREATE VIEW [dbo].[vwSTLRoomLooksProduct]
AS


	SELECT 
		rl.Title STLRoomLookTitle,
		p.ERPNumber,
		isnull(s.XPosition,0) XPosition,
		isnull(s.YPosition,0) YPosition,
		isnull(s.SortOrder,0) SortOrder,
		isnull(s.AdditionalProduct,0) AdditionalProduct,
		isnull(s.AdditionalProductSort,0) AdditionalProductSort
	FROM
		OEGSystemStaging.dbo.STLRoomLooksProducts s
		join OEGSystemStaging.dbo.STLRoomLooks rl on rl.STLRoomLookID = s.STLRoomLookID
		join OEGSystemStaging.dbo.Products sp on sp.ProductId = s.ProductId
		join Product p on p.ERPNumber = sp.Number


/*
select * from vwSTLRoomLooksProduct 
select * from OEGSystemStaging.dbo.STLRoomLooksProducts
select * from OEGSystemStaging.dbo.STLRoomLooks
*/

GO