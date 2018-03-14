	with combinedDimension as
	(
	select 
		p.Id ProductId, p.ERPNumber, dim.General, dim.Back, dim.Seat, dim.Arm, 
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
		and sp.BrandId = 1
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	group by 
		p.Id, p.ERPNumber, dim.General, dim.Back, dim.Seat, dim.Arm, sp.ItemId
	), 
	final as
	(
	select 
		cd.ProductId, cd.ERPNumber,
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
	 select * from final
