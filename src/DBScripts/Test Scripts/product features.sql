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
	--select s.ContentManagerId, 'New Revision', 
	--isnull(dim.General,''), 
	--1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	select p.ERPNumber, final.ProductFeaturesCombined
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Features'
	join final on final.ERPNumber = p.ERPNumber
	where s.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(final.ProductFeaturesCombined,'') != ''
	