IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwCategory') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwCategory]
GO


CREATE VIEW [dbo].[vwCategory]
AS


SELECT 
	c.Id,
	c.ParentId,
	c.WebSiteId,
	c.Name,
	c.ShortDescription,
	c.SmallImagePath,
	c.LargeImagePath,
	c.ActivateOn,
	c.DeactivateOn,
	c.UrlSegment,
	c.MetaKeywords,
	c.MetaDescription,
	c.SortOrder,
	c.ShowDetail,
	c.PageTitle,
	c.ContentManagerId,
	c.ERPProductValues,
	c.IsFeatured,
	c.IsDynamic,
	c.RuleManagerId,
	c.ImageAltText,
	c.SearchBoost,
	c.ProductSearchBoost,
	ws.Name WebsiteName,
	th.Name ThemeName,
	pc.Name ParentCategoryName,
	case when c.ParentId is null then ws.Name + ':' + c.Name  
	else ws.Name + ':' + pc.Name + ':' + c.Name end  WebsiteCategoryName
FROM
	Category c
	join WebSite ws on ws.Id = c.WebSiteId
	join Theme th on th.Id = ws.ThemeId
	left join Category pc on pc.Id = c.ParentId
where
	c.Id = '0F7423F5-87FD-E711-A98C-A3E0F1200094'
/*
select * from vwCategory
*/


GO