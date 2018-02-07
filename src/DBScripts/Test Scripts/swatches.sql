select * from StyleTrait

select * from OEGSystemStaging.dbo.ItemSwatchGroups where id = 62916
select * from OEGSystemStaging.dbo.ItemSwatches where GroupId = 62916
select * from OEGSystemStaging.dbo.ItemSKUsSwatches where SwatchId = 232836
select * from OEGSystemStaging.dbo.Products where itemid = 157714

select 
		styles.Id, sisg.[Name], sisg.WebSortOrder, convert(nvarchar(max),sisg.Id), 'etl', 'etl',  p.ERPNumber, sp.ItemId, sp.BrandId
	from
		OEGSystemStaging.dbo.ItemSwatchGroups sisg 
		join OEGSystemStaging.dbo.Products sp on sp.ItemId = sisg.ItemId
		--join OEGSystemStaging.dbo.Items si on si.ItemId = sp.ItemId
		join Product p on p.ERPNumber = sp.Number
		join StyleClass styles on styles.[Name] = sp.Number 
		join OEGSystemStaging.dbo.LookupItemStatuses luStatus on luStatus.Id = sp.StatusId
			and luStatus.Name = 'Active'
	where 
		sp.BrandId = 1 and sisg.Id = 62916

	select 
		trait.Id, convert(nvarchar(max),sis.SwatchId), sis.WebSortOrder, 0, sis.[Name], 'etl', 'etl', sis.GroupId
	from
		OEGSystemStaging.dbo.ItemSwatches sis 
		join OEGSystemStaging.dbo.ItemSwatchGroups sisg on sisg.Id = sis.GroupId
		join StyleTrait trait on trait.[Description] = convert(nvarchar(max),sisg.Id)
	where 
		isnull(sis.[Name],'') != '' and sis.SwatchId = 232836