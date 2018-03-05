IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwStyleTrait') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwStyleTrait]
GO


CREATE VIEW [dbo].[vwStyleTrait]
AS


SELECT 
	st.Id,
	st.StyleClassId,
	st.Name,
	UnselectedValue,
	SortOrder,
	st.Description,
	sc.Name StyleClassName
FROM
	dbo.StyleTrait st
	join StyleClass sc on sc.Id = st.StyleClassId
where st.id = '4CD035A1-D91B-E811-A98F-EF3518E6D53C'
/*
select * from [vwStyleTrait]
*/
GO