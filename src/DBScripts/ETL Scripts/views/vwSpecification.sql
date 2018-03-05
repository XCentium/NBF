IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwSpecification') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwSpecification]
GO


CREATE VIEW [dbo].[vwSpecification]
AS


SELECT top 100
	s.Id,
	s.ContentManagerId,
	s.Name,
	s.SortOrder,
	s.Description,
	s.IsActive,
	s.Value,
	s.CreatedOn,
	s.CreatedBy,
	s.ModifiedOn,
	s.ModifiedBy,
	s.ProductId,
	s.CategoryId,
	p.ERPNumber,
	c.Html SpecificationDescription
FROM
	dbo.Specification s
	join Product p on p.Id = s.ProductId
	left join Content c on c.ContentManagerId = s.ContentManagerId
where p.id = '62DE46BA-87FD-E711-A98C-A3E0F1200094'
/*
select * from [vwSpecification]
*/
GO