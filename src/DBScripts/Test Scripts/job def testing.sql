select * from [Insite.NBF].dbo.StyleClass where name = '31108'
select * from  StyleClass where name = '31108'
--update StyleClass set Description = '31108 variants' where name = '31108'

select * from vwProduct where id = '39c4d8b9-87fd-e711-a98c-a3e0f1200094'

select GETUTCDATE()
select getdate()

select top 1000 ModifiedOn,ContentManagerId,ERPNumber,IsDiscontinued, *  from [Insite.NBF].dbo.Product p 
--where p.ContentManagerId = '0E9192AE-AF3F-40E3-8880-7099A74AE273'
where ERPNumber = '10011'
order by p.ModifiedOn desc
--select * from StyleClass where id = 'A3CC6EB9-87FD-E711-A98C-A3E0F1200094'
select * from content where ContentManagerId = '42FBE14F-D55F-4B1E-B775-541B713B1E6A'
select * from [Insite.NBF].dbo.content where ContentManagerId = '42FBE14F-D55F-4B1E-B775-541B713B1E6A'
--update content set html='<b>carlos<b>' + Html where Id='F5969466-B917-E811-A98D-BD2E4F376635'

select s.*,c.Html,c.Id,c.PublishToProductionOn from [Insite.NBF].dbo.Specification s 
join [Insite.NBF].dbo.Content c on c.ContentManagerId = s.ContentManagerId
where s.ProductId = '62DE46BA-87FD-E711-A98C-A3E0F1200094'

select s.*,c.Html,c.Id,c.PublishToProductionOn from Specification s 
join Content c on c.ContentManagerId = s.ContentManagerId
where s.ProductId = '62DE46BA-87FD-E711-A98C-A3E0F1200094'

select * from [Insite.NBF].dbo.Category where id = '4A935E92-B888-4AC1-8D33-A89001573A1A'
select * from [Insite.NBF].dbo.Category where id = '91A2A73F-99F5-4D40-AD97-A89001573A11'


--delete from [Insite.NBF].dbo.Content where id = 'A4D0E893-DC67-40C7-9EB2-A89001573A32'

FE3F1AFE-EB87-4964-811C-A89001573A2D
E318B44D-D244-4D6E-B65A-A89001573A32
A4D0E893-DC67-40C7-9EB2-A89001573A32

select * from [Insite.NBF].dbo.StyleTrait
select * from [Insite.NBF].dbo.StyleClass where id = 'CCA272B9-87FD-E711-A98C-A3E0F1200094'
select * from StyleTrait

select top 10 * from [Insite.NBF].dbo.StyleTraitValue order by modifiedon desc
select top 10 * from StyleTraitValue order by modifiedon desc

select top 10 * from [Insite.NBF].dbo.StyleTraitValueProduct where ProductId = 'A2FA08BF-87FD-E711-A98C-A3E0F1200094'
select top 10 * from StyleTraitValueProduct where ProductId = 'A2FA08BF-87FD-E711-A98C-A3E0F1200094'
475A4156-F016-E811-A98D-BD2E4F376635
FB5F4156-F016-E811-A98D-BD2E4F376635
select IsDiscontinued,* from [Insite.NBF].dbo.Product where id = 'A2FA08BF-87FD-E711-A98C-A3E0F1200094'
select IsDiscontinued,* from Product where id = 'A2FA08BF-87FD-E711-A98C-A3E0F1200094'
select * from StyleTraitValue where id = '520A5CA1-D91B-E811-A98F-EF3518E6D53C'
select * from StyleTrait where id = 'E0F635A1-D91B-E811-A98F-EF3518E6D53C'


select * from [Insite.NBF].dbo.CategoryProduct where ProductId = 'B0CD38A9-DD0B-E811-A98C-A3E0F1200094'
select * from CategoryProduct where ProductId = 'B0CD38A9-DD0B-E811-A98C-A3E0F1200094'


--delete from [Insite.NBF].dbo.CategoryProduct where CategoryId = 'CA7612FC-C80B-E811-A98C-A3E0F1200094' and ProductId='B0CD38A9-DD0B-E811-A98C-A3E0F1200094'

select * from [Insite.NBF].dbo.Category where id = '0F7423F5-87FD-E711-A98C-A3E0F1200094'
select * from Category where id = '0F7423F5-87FD-E711-A98C-A3E0F1200094'
--update Category set ShortDescription = 'School Furniture2' where id = '0F7423F5-87FD-E711-A98C-A3E0F1200094'
