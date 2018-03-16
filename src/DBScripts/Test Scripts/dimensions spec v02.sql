	with combinedDimension as
	(
	select 
	p.Id ProductId, p.ERPNumber, dim.General, dim.Back, dim.Seat, dim.Arm, 
	'<ul class="nbf-product-custom-dimensions"><' + 
			STUFF((SELECT dd.DimensionName + ': ' + dd.DimensionValue as li
			FROM OEGSystemStaging.dbo.ItemDynamicDimensions dd
			WHERE dd.ItemId = sp.ItemId
			FOR XML PATH('')), 1, 1, '') +
			'</ul>' combinedDynamicDimension
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Dimensions'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = 1
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	)
	select 
		cd.ProductId, cd.ERPNumber,
		'<ul class="nbf-product-dimensions">' + 
		'<li>Dimensions: ' + cd.General + '</li>' +
		case when cd.Seat is null then '' else '<li>Seat Dimensions: ' + cd.Seat + '</li>' end +
		case when cd.Back is null then '' else '<li>Back Dimensions: ' + cd.Back + '</li>' end +
		case when cd.Arm is null then '' else '<li>Arm Dimensions: ' + cd.Arm + '</li>' end +
		case when cd.combinedDynamicDimension is null then '' else '<li>Custom Dimensions: ' + cd.combinedDynamicDimension + '</li>' end +
		'</ul>' Dimensions
	 from combinedDimension cd
	 where cd.ERPNumber = '10038'
