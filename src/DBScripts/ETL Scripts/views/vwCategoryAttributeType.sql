IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwCategoryAttributeType') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwCategoryAttributeType]
GO


CREATE VIEW [dbo].[vwCategoryAttributeType]
AS


SELECT 
	cattype.Id,
	cattype.CategoryId,
	cattype.AttributeTypeId,
	cattype.SortOrder,
	cattype.IsActive,
	cattype.DetailDisplaySequence,
	c.Name CategoryName,
	att.Name AttributeName,
	case when c.ParentId is null then ws.Name + ':' + c.Name  
	else ws.Name + ':' + pc.Name + ':' + c.Name end  WebsiteCategoryName
from
	CategoryAttributeType cattype
	join Category c on c.Id = cattype.CategoryId
	join AttributeType att on att.Id = cattype.AttributeTypeId
	join WebSite ws on ws.Id = c.WebSiteId
	left join Category pc on pc.Id = c.ParentId
--where
--	cattype.Id = 'B82B8EFC-87FD-E711-A98C-A3E0F1200094'

/*
select * from vwCategoryAttributeType
*/


GO