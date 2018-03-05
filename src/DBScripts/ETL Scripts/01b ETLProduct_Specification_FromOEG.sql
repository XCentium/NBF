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
	Dimensions
	*/

	-- first update the existing contents

	update Content set
	Html = isnull(dim.General,''),
	ModifiedOn = getdate()
	--select p.erpnumber, isnull(dim.General,''), c.Html, dim.ItemId
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Dimensions'
	join Content c on c.ContentManagerId = s.ContentManagerId
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	where c.Html != isnull(dim.General,'')
	and isnull(dim.General,'') != ''

	-- now insert any new ones we didn't have before

	insert into Content 
	(ContentManagerId, [Name], Html, Revision, LanguageId, PersonaId, ApprovedOn, PublishToProductionOn, DeviceType, CreatedBy, ModifiedBy)
	select s.ContentManagerId, 'New Revision', 
	isnull(dim.General,''), 
	1, @LanguageId, @PersonaId, getdate(), getdate(), 'Desktop', 'etl', 'etl' 
	--select p.ERPNumber, dim.General
	from Product p
	join Specification s on s.ProductId = p.Id and s.[Name] = 'Dimensions'
	join OEGSystemStaging.dbo.Products sp on sp.Number = p.ERPNumber
		and sp.BrandId = @brand
	join OEGSystemStaging.dbo.ItemDimensions dim on dim.ItemId = sp.ItemId
	where s.ContentManagerId not in (select ContentManagerId from Content)
	and isnull(dim.General,'') != ''



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
	Collection
	*/

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

	end

/*
exec ETLProductSpecification_FromOEG

delete from Content where ContentManagerId in
(
select s.ContentManagerId from product p
join Specification s on s.ProductId = p.Id
)

*/

end


