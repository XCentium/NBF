	declare @brand int
	set @brand = 1
	
	;with productFeaturesFiltered as
	(
		select distinct ProductId 
		from OEGSystemStaging.dbo.ProductFeatures pf
		where isnull(pf.Name,'') != '' 
	),
	final as
	(
	select p.ERPNumber,
			'<ul class="nbf-product-feature-style"><' + 
			STUFF((SELECT pf.Name as li
			FROM OEGSystemStaging.dbo.ProductFeatures pf
			WHERE pf.ProductId = sp.ProductId
			order by pf.WebSortOrder
			FOR XML PATH('')), 1, 1, '') +
			'</ul>' ProductFeaturesCombined
	from Product p
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join productFeaturesFiltered pff on pff.ProductId = sp.ProductId
	--where p.ERPNumber = '10011'
	)
	--update Content set
	--Html = isnull(final.ProductFeaturesCombined,''),
	--ModifiedOn = getdate()
	select p.erpnumber, isnull(final.ProductFeaturesCombined,''), c.Html
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Features'
	join Content c on c.ContentManagerId = s.ContentManagerId
	join final on final.ERPNumber = p.ERPNumber
	where c.Html != isnull(final.ProductFeaturesCombined,'')
	and isnull(final.ProductFeaturesCombined,'') != ''
	