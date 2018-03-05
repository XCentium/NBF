IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwProductAttributeValue') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwProductAttributeValue]
GO


CREATE VIEW [dbo].[vwProductAttributeValue]
AS


SELECT 
	pav.ProductId,
	pav.AttributeValueId,
	p.ERPNumber,
	av.Value AttributeValue,
	att.Name AttributeTypeName
from
	ProductAttributeValue pav
	join Product p on p.Id = pav.ProductId
	join AttributeValue av on av.Id = pav.AttributeValueId
	join AttributeType att on att.Id = av.AttributeTypeId
where
	pav.ProductId = 'CDA872B9-87FD-E711-A98C-A3E0F1200094'

/*
select * from vwProductAttributeValue
*/


GO