IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwStyleTraitValueProduct') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwStyleTraitValueProduct]
GO


CREATE VIEW [dbo].[vwStyleTraitValueProduct]
AS


SELECT 
	stvp.ProductId,
	stvp.StyleTraitValueId,
	p.ERPNumber,
	sc.Name StyleClassName,
	st.Name StyleTraitName,
	stv.Value StyleTraitValue
FROM
	dbo.StyleTraitValueProduct stvp
	join dbo.StyleTraitValue stv on stv.Id = stvp.StyleTraitValueId
	join StyleTrait st on st.Id = stv.StyleTraitId
	join StyleClass sc on sc.Id = st.StyleClassId
	join Product p on p.Id = stvp.ProductId
where p.id = 'A2FA08BF-87FD-E711-A98C-A3E0F1200094'

/*
select * from [vwStyleTraitValueProduct]
*/
GO