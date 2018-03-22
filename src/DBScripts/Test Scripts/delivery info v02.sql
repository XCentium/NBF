	declare @brand int
	set @brand = 1

	declare @LanguageId uniqueidentifier
	select top 1 @LanguageId = l.Id from [Language] l where LanguageCode = 'en-us'

	declare @PersonaId uniqueidentifier
	select top 1 @PersonaId = p.Id from Persona p where [Name] = 'Default'

	;with DeliveryVarables as
	(
	select 
		p.Id ProductId, p.ERPNumber, s.ContentManagerId, sp.DeliveryAmount, si.RequireTruck,
		max(lust.Code) ShipTypeCode,
		max(lusc.Code) ShipCodeCode,
		max(lult.Maximum) MaxLeadTime,
		max(lult.Minimum) MinLeadTime,
		count(spsku.ProductSKUId) OptionCount
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Delivery'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
	join OEGSystemStaging.dbo.ProductSKUs spsku on spsku.ProductId = sp.ProductId
	join OEGSystemStaging.dbo.ItemSKUs sisku on sisku.ItemSKUId = spsku.ItemSKUId
	join OEGSystemStaging.dbo.LookupShipTypes lust on lust.Id = sisku.ShipTypeId
	join OEGSystemStaging.dbo.LookupShipCodes lusc on lusc.Id = sisku.ShipCodeId
	join OEGSystemStaging.dbo.LookupLeadtimes lult on lult.Id = sisku.NormalLeadTimeId
		and lult.ShipCodeId = sisku.ShipCodeId
	group by 
		p.Id, p.ERPNumber, sp.ItemId, s.ContentManagerId, sp.DeliveryAmount, si.RequireTruck
	
	), 
	final as
	(
	select 
		dvs.ProductId, dvs.ERPNumber, dvs.ContentManagerId,
		case 
			when dvs.ShipTypeCode = 'I' and dvs.DeliveryAmount = 0 then 'This product ships for free and includes inside delivery.  Additional charges may apply for stairs or extra delivery services. Please call us at <b>111.222.5555</b> or type a message in the shipping instructions/order comments area during checkout if you require additional delivery services.'  
			when dvs.ShipTypeCode = 'I' then 'Due to the weight and size of this item, basic inside delivery is included in the delivery price. This means the item will be brought inside your building. Additional charges may apply for stairs or extra delivery services. Please call us at <b>333.333.5656</b> or type a message in the shipping instructions/order comments area during checkout if you require additional delivery services.' 
			when dvs.ShipTypeCode = 'T' then 'This product ships via tailgate truck, which means you will be required to take the product off the tailgate of the truck. Inside-delivery services are available if you need help bringing your items into your building. Simply select "Inside Delivery Services" during checkout to add this service. Additional charges apply. Allow an additional week for orders with inside delivery. Please contact us with any questions at 800-558-1010.' 
			when dvs.RequireTruck > 0 then '<li>UPS and FedEx deliveries will be brought inside your building. If you require additional services, please call <b>444.323.322</b></li><li>Items that are shipped via Truck will require someone at your location to take the products off the tailgate. If you need inside delivery, please call us at <b>444.323.322</b> or type a message in the shipping instructions/order comments area during checkout. Additional charges may apply for extra delivery services.</li>Delivery details will be indicated on your order acknowledgment.<br />'
		end DeliveryText,
		case 
			when dvs.RequireTruck - 3 = 1 then 'Up to ' + convert(nvarchar(max),dvs.RequireTruck - 3) + ' item will ship by UPS or FedEx Ground. ' + convert(nvarchar(max),dvs.RequireTruck) + ' or more items will ship by Truck.'
			else 'Up to ' + convert(nvarchar(max),dvs.RequireTruck - 3) + ' items will ship by UPS or FedEx Ground. ' + convert(nvarchar(max),dvs.RequireTruck) + ' or more items will ship by Truck.'
		end sText,
		case 
			when dvs.OptionCount = 1 and dvs.MinLeadTime in (0, 1) and dvs.MaxLeadTime = 1 then 'Allow 2-5 business days for delivery.'
			else 'Allow ' + convert(nvarchar(max), dvs.MinLeadTime) + '-' + convert(nvarchar(max), dvs.MaxLeadTime) + ' weeks for delivery.'
		end plcText
	 from DeliveryVarables dvs
	 )

	select f.ContentManagerId, 'New Revision', 
	isnull(f.DeliveryText,'') DeliveryText, isnull(f.sText,'') sText, isnull(f.plcText,'') plcText,
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 

	--select f.ProductId, f.ERPNumber, f.Delivery 
	from final f
	--where f.ContentManagerId not in (select ContentManagerId from Content)
	--where isnull(f.Delivery,'') != ''
