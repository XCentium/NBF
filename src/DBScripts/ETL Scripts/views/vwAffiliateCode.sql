IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwAffiliateCode') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwAffiliateCode
GO


CREATE VIEW [dbo].[vwAffiliateCode]
AS


	SELECT 
		s.Id AffiliateID,
		s.Code AffiliateCode

	FROM
		OEGSystemStaging.dbo.AffiliateCodes s
	WHERE
		s.BrandId = 1

/*
select * from vwAffiliateCode 
select * from OEGSystemStaging.dbo.AffiliateCodes
*/

GO