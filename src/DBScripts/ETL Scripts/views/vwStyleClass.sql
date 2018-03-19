IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwStyleClass') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwStyleClass]
GO


CREATE VIEW [dbo].[vwStyleClass]
AS


SELECT 
	s.Id,
	s.Name,
	s.Description,
	s.IsActive,
	s.CreatedOn,
	s.CreatedBy,
	s.ModifiedOn,
	s.ModifiedBy
FROM
	dbo.StyleClass s



GO