IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwProductImage') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwProductImage]
GO


CREATE VIEW [dbo].[vwProductImage]
AS


SELECT 
	pim.Id,
	pim.ProductId,
	pim.Name,
	pim.SmallImagePath,
	pim.MediumImagePath,
	pim.LargeImagePath,
	pim.AltText,
	pim.SortOrder,
	p.ERPNumber
FROM
	dbo.ProductImage pim
	join Product p on p.Id = pim.ProductId
--where
--	p.Id = 'CDA872B9-87FD-E711-A98C-A3E0F1200094'
/*
select * from vwProductImage
*/
GO