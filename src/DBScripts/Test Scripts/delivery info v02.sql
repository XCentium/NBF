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
		and sp.BrandId = 1
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
		ShipTypeCode Delivery
	 from DeliveryVarables dvs
	 )
	select f.ContentManagerId, 'New Revision', 
	isnull(f.Delivery,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select f.ProductId, f.ERPNumber, f.Delivery 
	from final f
	--where f.ContentManagerId not in (select ContentManagerId from Content)
	where isnull(f.Delivery,'') != ''
