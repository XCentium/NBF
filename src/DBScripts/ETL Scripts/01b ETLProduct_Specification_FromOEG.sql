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

	-- first we delete the old data since we are just going to replace it
	delete from content where ContentManagerId in (select ContentManagerId from Specification where [name] = 'Delivery')

	-- now insert any new ones we didn't have before

	;with DeliveryVarables as
	(
	select 
		p.Id ProductId, p.ERPNumber, s.ContentManagerId, 
		isnull(sp.DeliveryAmount,0) DeliveryAmount, 
		isnull(si.RequireTruck,0) RequireTruck,
		isnull(si.CanBreakCarton,0) CanBreakCarton, 
		isnull(si.QtyPerCarton,0) QtyPerCarton,
		case when isnull(si.CanBreakCarton,0) = 0 and isnull(si.QtyPerCarton,0) > 1 then si.QtyPerCarton else 1 end QtyPurchaseMultiplier,
		max(lust.Code) ShipTypeCode,
		max(lusc.Code) ShipCodeCode,
		max(lult.Maximum) MaxLeadTime,
		max(lult.Minimum) MinLeadTime,
		count(distinct(spsku.OptionCode)) OptionCount,
		count(distinct(sicd.Name)) CartonCount,
		count(distinct(isnull(lult.Minimum,0)+isnull(lult.Maximum,0))) AllSameLeadTimeCount,
		'<table><tr><td><u>Color/Finish Option</u></td><td>&nbsp;&nbsp;&nbsp;</td><td><u>Delivery Time</u></td></tr>' + 
				(SELECT 
					iq_spsku.Description as td,
					'   ' as td,
					case 
						when iq_sisku.NormalLeadTimeId = 1 and iq_sisku.CurrentLeadTimeId is null then 'Ships Today (2-5 business days for delivery)'
						when iq_lult.Minimum = 1 and iq_lult.Minimum = iq_lult.Maximum then '1 week'
						when iq_lult.Minimum = 0 and iq_lult.Maximum = 1 then '1 week'
						else convert(nvarchar(max), iq_lult.Minimum) + '-' + convert(nvarchar(max), iq_lult.Maximum) + ' weeks'
					end td
				FROM OEGSystemStaging.dbo.ProductSKUs iq_spsku
				join OEGSystemStaging.dbo.ItemSKUs iq_sisku on iq_sisku.ItemSKUId = iq_spsku.ItemSKUId
					and iq_spsku.EffEndDate > getdate() and iq_spsku.IsWebEnabled = 1
				join OEGSystemStaging.dbo.LookupLeadtimes iq_lult on iq_lult.Id = iq_sisku.NormalLeadTimeId
					and iq_lult.ShipCodeId = iq_sisku.ShipCodeId
				WHERE iq_spsku.ProductId = sp.ProductId
				FOR XML RAW('tr'), ELEMENTS) 
				+ '</table>' 
				deliveryTable
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Delivery'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
		and spsku.EffEndDate > getdate() and spsku.IsWebEnabled = 1
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	join OEGSystemStaging.dbo.LookupShipTypes lust on lust.Id = sisku.ShipTypeId
	join OEGSystemStaging.dbo.LookupShipCodes lusc on lusc.Id = sisku.ShipCodeId
	join OEGSystemStaging.dbo.LookupLeadtimes lult on lult.Id = sisku.NormalLeadTimeId
		and lult.ShipCodeId = sisku.ShipCodeId
	left join OEGSystemStaging.dbo.ItemCartonDimensions sicd on sicd.ItemId = si.ItemId
	group by 
		p.Id, p.ERPNumber, sp.ItemId, s.ContentManagerId, 
		sp.DeliveryAmount, si.RequireTruck, si.CanBreakCarton, si.QtyPerCarton, sp.ProductId
	
	), 
	interim as
	(
	select 
		dvs.ProductId, dvs.ERPNumber, dvs.ContentManagerId, dvs.QtyPerCarton, dvs.CartonCount, dvs.OptionCount, dvs.DeliveryAmount, dvs.RequireTruck,
		case 
			when dvs.ShipTypeCode = 'I' and dvs.DeliveryAmount = 0 then 'This product ships for free and includes inside delivery.  Additional charges may apply for stairs or extra delivery services. Please call us at <b>800-558-1010</b> or type a message in the shipping instructions/order comments area during checkout if you require additional delivery services.'  
			when dvs.ShipTypeCode = 'I' then 'Due to the weight and size of this item, basic inside delivery is included in the delivery price. This means the item will be brought inside your building. Additional charges may apply for stairs or extra delivery services. Please call us at <b>800-558-1010</b> or type a message in the shipping instructions/order comments area during checkout if you require additional delivery services.' 
			when dvs.ShipTypeCode = 'T' then 'This product ships via tailgate truck, which means you will be required to take the product off the tailgate of the truck. Inside-delivery services are available if you need help bringing your items into your building. Simply select "Inside Delivery Services" during checkout to add this service. Additional charges apply. Allow an additional week for orders with inside delivery. Please contact us with any questions at 800-558-1010.' 
			when dvs.RequireTruck > 0 then '<li>UPS and FedEx deliveries will be brought inside your building. If you require additional services, please call <b>800-558-1010</b></li><li>Items that are shipped via Truck will require someone at your location to take the products off the tailgate. If you need inside delivery, please call us at <b>800-558-1010</b> or type a message in the shipping instructions/order comments area during checkout. Additional charges may apply for extra delivery services.</li><br>Delivery details will be indicated on your order acknowledgment.'
			else 'This product ships via UPS or FedEx and will be brought inside your building. If you require additional services, please call <b>800-558-1010</b>.'
		end DeliveryText,
		case 
			when dvs.RequireTruck <= 0 then ''
			when (dvs.RequireTruck - dvs.QtyPurchaseMultiplier) = 1 then 'Up to ' + convert(nvarchar(max),dvs.RequireTruck - dvs.QtyPurchaseMultiplier) + ' item will ship by UPS or FedEx Ground. ' + convert(nvarchar(max),dvs.RequireTruck) + ' or more items will ship by Truck.'
			else 'Up to ' + convert(nvarchar(max),dvs.RequireTruck - dvs.QtyPurchaseMultiplier) + ' items will ship by UPS or FedEx Ground. ' + convert(nvarchar(max),dvs.RequireTruck) + ' or more items will ship by Truck.'
		end sText,
		case 
			when (dvs.OptionCount = 1 or AllSameLeadTimeCount = 1) then
				case 
					when (dvs.MinLeadTime in (0, 1) and dvs.MaxLeadTime = 1) then 'Allow 2-5 business days for delivery.'
					else 'Allow ' + convert(nvarchar(max), dvs.MinLeadTime) + '-' + convert(nvarchar(max), dvs.MaxLeadTime) + ' weeks for delivery.'
				end
			else 'See delivery times below.'
		end plcText,
		case 
			when dvs.DeliveryAmount = 0 and dvs.ShipTypeCode = 'I' then 'This item includes free inside delivery!'
			when dvs.DeliveryAmount = 0 then 'This item includes free tailgate delivery (see description below). Inside delivery services are available for an additional charge.'
			else 'Your delivery charge will be calculated at checkout.'
		end chargeText,

		case
			when dvs.CartonCount <> 0 then 
				case
					when dvs.CartonCount = 1 then 
						case
							when dvs.QtyPurchaseMultiplier > 1 then 'This item ships with ' + convert(nvarchar(max), dvs.QtyPurchaseMultiplier) + ' per carton.'
							else 'This item ships in ' + convert(nvarchar(max), dvs.CartonCount) + ' carton.'
							end
					else 'This item ships in ' + convert(nvarchar(max), dvs.CartonCount) + ' cartons.'
					end
			else ''
		end chargeTextCartonCount,
		
		
		case
			when dvs.CartonCount <> 0 then 
				case
					when dvs.CartonCount <> 1 and  dvs.QtyPurchaseMultiplier > 1 then 'This item ships ' + convert(nvarchar(max), dvs.QtyPurchaseMultiplier) + ' per carton.'
					else ''
					end
			when dvs.QtyPurchaseMultiplier > 1 then 'This item ships ' + convert(nvarchar(max), dvs.QtyPurchaseMultiplier) + ' per carton.'
			else ''
		end chargeTextItemsPerCarton,

		case
			when dvs.OptionCount > 0 and AllSameLeadTimeCount > 1 and not (dvs.MinLeadTime in (0, 1) and dvs.MaxLeadTime = 1) then deliveryTable
			else ''
		end plcPostText

	 from DeliveryVarables dvs
	 ),
	 final as
	 (
	 select
		i.ProductId, i.ERPNumber, i.ContentManagerId,
		convert(nvarchar(max), i.chargeText) + '<br>' +
		convert(nvarchar(max), i.chargeTextCartonCount) + '<br>' +
		convert(nvarchar(max), i.chargeTextItemsPerCarton) +  '<br>' +
		convert(nvarchar(max), i.plcText) +  '<br><br>' +
		convert(nvarchar(max), i.sText) +  '<br>' +
		convert(nvarchar(max), i.DeliveryText) +  '<br><br>' +
		convert(nvarchar(max), i.plcPostText) 
		Delivery
		,
		isnull(i.DeliveryText,'') DeliveryText, isnull(i.sText,'') sText, isnull(i.plcText,'') plcText, 
		isnull(i.chargeText,'') chargeText, isnull(i.chargeTextCartonCount,'') chargeTextCartonCount, 
		isnull(i.chargeTextItemsPerCarton,'') chargeTextItemsPerCarton,
		isnull(i.plcPostText,'') plcPostText
	 from interim i
	 	)
	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select f.ContentManagerId, 'New Revision', 
	isnull(f.Delivery,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--,f.ProductId, f.ERPNumber, f.Delivery, f.chargeText, f.chargeTextCartonCount, f.chargeTextItemsPerCarton, f.plcText, f.sText, f.DeliveryText, f.plcPostText
	from final f
	where f.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(f.Delivery,'') != ''
	--and f.ERPNumber = '56848'

	/*
	Dimensions
	*/

	-- first we delete the old data since we are just going to replace it
	delete from content where ContentManagerId in (select ContentManagerId from Specification where [name] = 'Dimensions')

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

	-- first we delete the old data since we are just going to replace it
	delete from content where ContentManagerId in (select ContentManagerId from Specification where [name] = 'Vendor Code')

	update Specification set 
		[Value] = isnull(v.Code,'')
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Vendor Code'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Vendors v on v.VendorId = sp.PrimaryVendorId

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

	-- first we delete the old data since we are just going to replace it
	delete from content where ContentManagerId in (select ContentManagerId from Specification where [name] = 'Rating')

	update Specification set 
		[Value] = isnull(spr.Rating,0)
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Rating'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	left join OEGSystemStaging.dbo.ProductRating spr on spr.ProductOID = sp.Number

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
	Product Features
	*/

	-- first we delete the old data since we are just going to replace it
	delete from content where ContentManagerId in (select ContentManagerId from Specification where [name] = 'Features')

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


