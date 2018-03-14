IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwVendor') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwVendor]
GO


CREATE VIEW [dbo].[vwVendor]
AS


SELECT 
		v.Id,
		VendorNumber,
		case when isnull(v.Name,'') = '' then '<blank>' else v.Name end Name,
		Address1,
		Address2,
		City,
		State,
		PostalCode,
		WebSiteAddress,
		ContactName,
		ContactEmail,
		Phone,
		Ranking,
		RegularMarkup,
		SaleMarkup,
		VendorMessage,
		CountryId,
		v.CreatedOn,
		v.CreatedBy,
		v.ModifiedOn,
		v.ModifiedBy,
		isnull(c.ISOCode2,'US') CountryISOCode2
FROM
	dbo.Vendor v
	left join Country c on c.Id = v.CountryId


GO