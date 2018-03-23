IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductSpecification_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductSpecification_FromOEG
GO


CREATE procedure [dbo].ETLProductSpecification_FromOEG 
as
begin

	-- copy dependency tables

	declare @brand int
	set @brand = 1
	
	--insert into Language
	--select * from [Insite.NBF].dbo.[Language]
	--where Id not in (select Id from Language)


	--insert into Persona
	--select * from [Insite.NBF].dbo.Persona
	--where Id not in (select Id from Persona)

	declare @LanguageId uniqueidentifier
	select top 1 @LanguageId = l.Id from [Language] l where LanguageCode = 'en-us'

	declare @PersonaId uniqueidentifier
	select top 1 @PersonaId = p.Id from Persona p where [Name] = 'Default'


	if @LanguageId is null or @PersonaId is null 
	begin
		select '@LanguageId is null or @PersonaId is null'
	end
	else
	begin


	/*
	Delivery
	*/



	/*
	Dimensions
	*/

	-- first update the existing contents

	;with combinedDimension as
	(
	select 
		p.Id ProductId, p.ERPNumber, s.ContentManagerId, dim.General, dim.Back, dim.Seat, dim.Arm, 
		'<ul class="nbf-product-custom-dimensions"><' + 
				STUFF((SELECT dd.DimensionName + ': ' + dd.DimensionValue as li
				FROM OEGSystemStaging.dbo.ItemDynamicDimensions dd
				WHERE dd.ItemId = sp.ItemId
				FOR XML PATH('')), 1, 1, '') +
				'</ul>' combinedDynamicDimension,
		'<ul class="nbf-product-carton-dimensions"><' + 
				STUFF((SELECT format(cartonD.Width,'####.##') + '"W x ' + 
					format(cartonD.[Length],'####.##') + '"D x ' + 
					format(cartonD.Height,'####.##') + '"H'
					as li
				FROM OEGSystemStaging.dbo.ItemCartonDimensions cartonD
				WHERE cartonD.ItemId = sp.ItemId
				FOR XML PATH('')), 1, 1, '') +
				'</ul>' combinedCartonDimension,
		max(sisku.[Weight]) [Weight], 
		max(sisku.GSASIN) GSASIN
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Dimensions'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
		and spsku.EffEndDate > getdate() and spsku.IsWebEnabled = 1
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	group by 
		p.Id, p.ERPNumber, dim.General, dim.Back, dim.Seat, dim.Arm, sp.ItemId, s.ContentManagerId
	), 
	final as
	(
	select 
		cd.ProductId, cd.ERPNumber, cd.ContentManagerId,
		'<ul class="nbf-product-dimensions">' + 
		'<li>Dimensions: ' + cd.General + '</li>' +
		case when cd.Seat is null then '' else '<li>Seat Dimensions: ' + cd.Seat + '</li>' end +
		case when cd.Back is null then '' else '<li>Back Dimensions: ' + cd.Back + '</li>' end +
		case when cd.Arm is null then '' else '<li>Arm Dimensions: ' + cd.Arm + '</li>' end +
		case when cd.combinedDynamicDimension is null then '' else '<li>Custom Dimensions: ' + cd.combinedDynamicDimension + '</li>' end +
		case when cd.[Weight] is null then '' else '<li>Weight: ' + convert(nvarchar(max),cd.[Weight]) + ' lbs.</li>' end +
		case when cd.GSASIN is null then '' else '<li>SIN#: ' + convert(nvarchar(max),cd.GSASIN) + '</li>' end +
		case when cd.combinedCartonDimension is null then '' else '<li>Carton Dimensions: ' + cd.combinedCartonDimension + '</li>' end +
		'</ul>' Dimensions
	 from combinedDimension cd
	 --where combinedCartonDimension is not null
	 --where cd.ERPNumber = '56948'
	 )
	update Content set
	Html = isnull(f.Dimensions,''),
	ModifiedOn = getdate()
	--select f.ProductId, f.ERPNumber, f.Dimensions 
	from final f
	join Content c on c.ContentManagerId = f.ContentManagerId
	where c.Html != isnull(f.Dimensions,'')
	and isnull(f.Dimensions,'') != ''

	-- now insert any new ones we didn't have before

	;with combinedDimension as
	(
	select 
		p.Id ProductId, p.ERPNumber, s.ContentManagerId, dim.General, dim.Back, dim.Seat, dim.Arm, 
		'<ul class="nbf-product-custom-dimensions"><' + 
				STUFF((SELECT dd.DimensionName + ': ' + dd.DimensionValue as li
				FROM OEGSystemStaging.dbo.ItemDynamicDimensions dd
				WHERE dd.ItemId = sp.ItemId
				FOR XML PATH('')), 1, 1, '') +
				'</ul>' combinedDynamicDimension,
		'<ul class="nbf-product-carton-dimensions"><' + 
				STUFF((SELECT format(cartonD.Width,'####.##') + '"W x ' + 
					format(cartonD.[Length],'####.##') + '"D x ' + 
					format(cartonD.Height,'####.##') + '"H'
					as li
				FROM OEGSystemStaging.dbo.ItemCartonDimensions cartonD
				WHERE cartonD.ItemId = sp.ItemId
				FOR XML PATH('')), 1, 1, '') +
				'</ul>' combinedCartonDimension,
		max(sisku.[Weight]) [Weight], 
		max(sisku.GSASIN) GSASIN
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Dimensions'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
		and spsku.EffEndDate > getdate() and spsku.IsWebEnabled = 1
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	group by 
		p.Id, p.ERPNumber, dim.General, dim.Back, dim.Seat, dim.Arm, sp.ItemId, s.ContentManagerId
	), 
	final as
	(
	select 
		cd.ProductId, cd.ERPNumber, cd.ContentManagerId,
		'<ul class="nbf-product-dimensions">' + 
		'<li>Dimensions: ' + cd.General + '</li>' +
		case when cd.Seat is null then '' else '<li>Seat Dimensions: ' + cd.Seat + '</li>' end +
		case when cd.Back is null then '' else '<li>Back Dimensions: ' + cd.Back + '</li>' end +
		case when cd.Arm is null then '' else '<li>Arm Dimensions: ' + cd.Arm + '</li>' end +
		case when cd.combinedDynamicDimension is null then '' else '<li>Custom Dimensions: ' + cd.combinedDynamicDimension + '</li>' end +
		case when cd.[Weight] is null then '' else '<li>Weight: ' + convert(nvarchar(max),cd.[Weight]) + ' lbs.</li>' end +
		case when cd.GSASIN is null then '' else '<li>SIN#: ' + convert(nvarchar(max),cd.GSASIN) + '</li>' end +
		case when cd.combinedCartonDimension is null then '' else '<li>Carton Dimensions: ' + cd.combinedCartonDimension + '</li>' end +
		'</ul>' Dimensions
	 from combinedDimension cd
	 --where combinedCartonDimension is not null
	 --where cd.ERPNumber = '56948'
	 )
	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select f.ContentManagerId, 'New Revision', 
	isnull(f.Dimensions,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select f.ProductId, f.ERPNumber, f.Dimensions 
	from final f
	where f.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(f.Dimensions,'') != ''


	/*
	Vendor Code
	*/

	-- first update the existing contents

	update Content set
	Html = isnull(v.Code,''),
	ModifiedOn = getdate()
	--select p.erpnumber, isnull(v.Code,''), c.Html, v.VendorId
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Vendor Code'
	join Content c on c.ContentManagerId = s.ContentManagerId
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Vendors v on v.VendorId = sp.PrimaryVendorId
	where c.Html != isnull(v.Code,'') 
	and isnull(v.Code,'') != ''

	-- now insert any new ones we didn't have before

	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select s.ContentManagerId, 'New Revision', 
	isnull(v.Code,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select p.ERPNumber, v.Code
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Vendor Code'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Vendors v on v.VendorId = sp.PrimaryVendorId
	where s.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(v.Code,'') != ''


	/*
	Rating
	*/

	-- first update the existing contents

	update Content set
	Html = isnull(spr.Rating,0),
	ModifiedOn = getdate()
	--select p.erpnumber, isnull(spr.Rating,0), c.Html
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Rating'
	join Content c on c.ContentManagerId = s.ContentManagerId
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.ProductRating spr on spr.ProductOID = sp.Number
	where c.Html != isnull(spr.Rating,0) 

	-- now insert any new ones we didn't have before

	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select s.ContentManagerId, 'New Revision', 
	isnull(spr.Rating,0), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select p.ERPNumber, spr.Rating
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Rating'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.ProductRating spr on spr.ProductOID = sp.Number
	where s.ContentManagerId not in (select ContentManagerId from Content)


	/*
	Collection - this has been moved to an attribute
	*/

	/*
	-- first update the existing contents

	update Content set
	Html = isnull(sic.[Name],''),
	ModifiedOn = getdate()
	--select p.erpnumber, isnull(sic.[Name],''), c.Html, sic.CollectionId
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Collection'
	join Content c on c.ContentManagerId = s.ContentManagerId
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemCollections sic on sic.CollectionId = si.CollectionId
	where c.Html != isnull(sic.[Name],'') 
	and isnull(sic.[Name],'') != ''

	-- now insert any new ones we didn't have before

	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select s.ContentManagerId, 'New Revision', 
	isnull(sic.[Name],''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select p.ERPNumber, sic.[Name]
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Collection'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ItemCollections sic on sic.CollectionId = si.CollectionId
	where s.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(sic.[Name],'') != ''
	*/
	

	/* 
	Product Features
	*/

	-- first update the existing contents

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
	update Content set
	Html = isnull(final.ProductFeaturesCombined,''),
	ModifiedOn = getdate()
	--select p.erpnumber, isnull(final.ProductFeaturesCombined,''), c.Html
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Features'
	join Content c on c.ContentManagerId = s.ContentManagerId
	join final on final.ERPNumber = p.ERPNumber
	where c.Html != isnull(final.ProductFeaturesCombined,'')
	and isnull(final.ProductFeaturesCombined,'') != ''


	-- now insert any new ones we didn't have before
	
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
	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select s.ContentManagerId, 'New Revision', 
	isnull(final.ProductFeaturesCombined,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select p.ERPNumber, final.ProductFeaturesCombined
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Features'
	join final on final.ERPNumber = p.ERPNumber
	where s.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(final.ProductFeaturesCombined,'') != ''

	end

/*
exec ETLProductSpecification_FromOEG

delete from Content where ContentManagerId in
(
select s.ContentManagerId from product p
join Specification s on s.ProductId = p.Id

)

delete from content where ContentManagerId in 
(
select ContentManagerId from Specification where Name = 'Collection'
)
delete from Specification where Name = 'Collection'

*/



end


