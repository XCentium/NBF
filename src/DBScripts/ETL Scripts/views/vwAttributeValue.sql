IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwAttributeValue') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwAttributeValue]
GO


CREATE VIEW [dbo].[vwAttributeValue]
AS


SELECT 
	atv.Id,
	atv.AttributeTypeId,
	atv.Value,
	atv.SortOrder,
	atv.IsActive,
	att.Name AttributeName
from
	AttributeValue atv
	join AttributeType att on att.Id = atv.AttributeTypeId
where
	atv.Id = 'A82D8EFC-87FD-E711-A98C-A3E0F1200094'

/*
select * from vwAttributeValue
*/


GO