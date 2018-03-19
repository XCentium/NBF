select * from products where number = '10011'

select * from ItemsWebCategories where itemid = 173310
select * from ItemWebCategoryDisplayNames where WebCategoryId = 16
select * from InsiteETL.dbo.Category where ShortDescription like '%Office Furniture%'
select * from ItemWebCategoryDisplayNames where DisplayName like '%office%'

select * from InsiteETL.dbo.Product where ERPNumber = '10011'
select * from InsiteETL.dbo.CategoryProduct where ProductId = '62DE46BA-87FD-E711-A98C-A3E0F1200094'
select count(*) from InsiteETL.dbo.CategoryProduct
118007

select * from [Insite.nbf].dbo.Product where ERPNumber = '10011'
select * from [Insite.nbf].dbo.CategoryProduct where ProductId = '62DE46BA-87FD-E711-A98C-A3E0F1200094'
select count(*) from [Insite.nbf].dbo.CategoryProduct
118011

select * from [Insite.nbf].dbo.CategoryProduct where id not in (
select id from InsiteETL.dbo.CategoryProduct
)

select * from InsiteETL.dbo.Category where id = '7E7523F5-87FD-E711-A98C-A3E0F1200094'
select * from [Insite.nbf].dbo.Category where id = '7E7523F5-87FD-E711-A98C-A3E0F1200094'