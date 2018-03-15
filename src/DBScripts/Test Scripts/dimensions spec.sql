	with combinedDimension as
	(
	select 
	p.Id ProductId, p.ERPNumber, dim.General, dim.Back, dim.Seat, dim.Arm, 
	dyn.DimensionName, dyn.DimensionValue
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Dimensions'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = 1
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	left join OEGSystemStaging.dbo.ItemDynamicDimensions dyn on dyn.ItemId = sp.ItemId
	)
	select 
		cd.ProductId, cd.ERPNumber,
		'<ul class="nbf-product-dimensions">' + 
		'<li>Dimensions: ' + cd.General + '</li>' +
		case when cd.Seat is null then '' else '<li>Seat Dimensions: ' + cd.Seat + '</li>' end +
		case when cd.Back is null then '' else '<li>Back Dimensions: ' + cd.Back + '</li>' end +
		case when cd.Arm is null then '' else '<li>Arm Dimensions: ' + cd.Arm + '</li>' end +
		'</ul>',
		cd.DimensionName, cd.DimensionValue
	 from combinedDimension cd
	 --where gd.ERPNumber = '10038'
