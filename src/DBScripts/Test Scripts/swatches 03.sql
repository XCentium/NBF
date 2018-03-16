	select p.ERPNumber,p.*
	from StyleTraitValue stv
		join StyleTrait st on st.Id = stv.StyleTraitId 
		join StyleClass sc on sc.Id = st.StyleClassId
		join Product p on p.ERPNumber = sc.[Name] + ':' + st.[Description] + ':' + stv.[Description]

		 --
		 --62079

		 select p.ERPNumber,p.* from Product p where ERPNumber like '%:%'
		 and p.ERPNumber not in 
		 (
	select p.ERPNumber
	from StyleTraitValue stv
		join StyleTrait st on st.Id = stv.StyleTraitId 
		join StyleClass sc on sc.Id = st.StyleClassId
		join Product p on p.ERPNumber = sc.[Name] + ':' + st.[Description] + ':' + stv.[Description]
		 )

		 10561:69633:260928
		 10011:70389:263768
		 13528S:48713:177889
		 select * from StyleTraitValue stv where stv.Description = '177889'
		 select * from StyleTrait st where st.Description = '48713'
		 select * from StyleClass sc where sc.Name = '13528S'
		 select * from StyleClass where id = '5CE36EB9-87FD-E711-A98C-A3E0F1200094'
		 select * from product where ERPNumber = '13528S'
		 select * from StyleTrait where StyleClassId = '477B35B7-87FD-E711-A98C-A3E0F1200094'


		 select  distinct
		p.ERPNumber + ':' + st.[Description] + ':' + stv.[Description] ERPNumber,
		stv.[Value] [Name],
		p.ShortDescription + ' - ' + st.[Name] + ' - ' + stv.[Value]  ShortDescription,
		p.ERPNumber ProductCode, st.[Name] ModelNumber,
		LOWER(replace(dbo.UrlFriendlyString(ltrim(rtrim(isnull(p.ERPNumber + ':' + st.[Name] + ':' + stv.[Value],'')))),'/','-')) UrlSegment,
		st.Id, stv.Id,
		'00000000-0000-0000-0000-000000000000' ContentManagerId, 'etl', 'etl'
	from 
		StyleTraitValueProduct stvp
		join StyleTraitValue stv on stv.Id = stvp.StyleTraitValueId
		join StyleTrait st on st.Id = stv.StyleTraitId
		join StyleClass sc on sc.Id = st.StyleClassId
		join Product p on p.StyleClassId = sc.Id
	where p.ERPNumber = '13528'


	--delete from Product where ERPNumber like '%:%'

	select p.id, isnull(sis.WebPath,'') [SmallImagePath], p.Name [AltText]
	from 
		Product p 
		join OEGSystemStaging.dbo.ItemSwatches sis on convert(nvarchar(max),sis.SwatchId) = RIGHT(p.ERPNumber,CHARINDEX(':',REVERSE(p.ERPNumber))-1) 
	where
		p.ContentManagerId = '00000000-0000-0000-0000-000000000000'
		and not exists (select Id from ProductImage where ProductId = p.Id)