IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwAttributeType') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwAttributeType]
GO


CREATE VIEW [dbo].[vwAttributeType]
AS


SELECT 
	Id,
	Name,
	IsActive,
	Label,
	IsFilter,
	IsComparable
from
	AttributeType att
--where
--	att.Id = 'B72B8EFC-87FD-E711-A98C-A3E0F1200094'

/*
select * from vwAttributeType
*/


GO