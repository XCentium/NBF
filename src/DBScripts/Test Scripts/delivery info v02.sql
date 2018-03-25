	declare @brand int
	set @brand = 1

	declare @LanguageId uniqueidentifier
	select top 1 @LanguageId = l.Id from [Language] l where LanguageCode = 'en-us'

	declare @PersonaId uniqueidentifier
	select top 1 @PersonaId = p.Id from Persona p where [Name] = 'Default'

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
	--insert into Content 
	--(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select f.ContentManagerId, 'New Revision', 
	isnull(f.Delivery,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--,f.ProductId, f.ERPNumber, f.Delivery, f.chargeText, f.chargeTextCartonCount, f.chargeTextItemsPerCarton, f.plcText, f.sText, f.DeliveryText, f.plcPostText
	from final f
	--where f.ContentManagerId not in (select ContentManagerId from Content)
	where isnull(f.Delivery,'') != ''
	and f.ERPNumber = '51365'