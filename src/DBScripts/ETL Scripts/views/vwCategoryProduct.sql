IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwCategoryProduct') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwCategoryProduct]
GO


CREATE VIEW [dbo].[vwCategoryProduct]
AS


SELECT 
	c.Id CategoryId,
	p.Id ProductId,
	ws.Name WebSiteName,
	c.Name CategoryName,
	pc.Name ParentCategoryName,
	p.ERPNumber,
	case when c.ParentId is null then ws.Name + ':' + c.Name  
	else ws.Name + ':' + pc.Name + ':' + c.Name end  WebsiteCategoryName
FROM
	CategoryProduct cp
	join Category c on c.Id = cp.CategoryId
	join Product p on p.Id = cp.ProductId
	join WebSite ws on ws.Id = c.WebSiteId
	left join Category pc on pc.Id = c.ParentId
--where
--	p.Id = 'B0CD38A9-DD0B-E811-A98C-A3E0F1200094'
/*
select * from vwCategoryProduct
*/


GO