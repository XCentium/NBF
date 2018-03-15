IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwStyleTraitValue') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwStyleTraitValue]
GO


CREATE VIEW [dbo].[vwStyleTraitValue]
AS


SELECT
	stv.Id,
	stv.StyleTraitId,
	stv.Value,
	stv.SortOrder,
	stv.IsDefault,
	stv.Description,
	sc.Name StyleClassName,
	st.Name StyleTraitName
FROM
	dbo.StyleTraitValue stv
	join StyleTrait st on st.Id = stv.StyleTraitId
	join StyleClass sc on sc.Id = st.StyleClassId
--where stv.id = '520A5CA1-D91B-E811-A98F-EF3518E6D53C'
/*
select * from [vwStyleTraitValue]
*/
GO