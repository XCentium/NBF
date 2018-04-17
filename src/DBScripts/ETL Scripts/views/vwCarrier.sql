IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwCarrier') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwCarrier
GO


CREATE VIEW [dbo].[vwCarrier]
AS


	SELECT 
		c.Name,
		c.Enable

	FROM
		Carrier c

/*
select * from vwCarrier 
*/

GO