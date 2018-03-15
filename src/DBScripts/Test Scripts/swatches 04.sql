select * from Specification where ProductId in (select Id from Product where ERPNumber not like '%:%')
select ContentManagerId, * from Product where ERPNumber  like '%:%' 
62242
select ContentManagerId, * from Product where ContentManagerId = '00000000-0000-0000-0000-000000000000'



select * from content where ContentManagerId = 'FB00DA0A-0E84-4B9A-A023-0000C3DF9650'

select * from ContentManager where id = 'E222C3BB-2DAB-4589-9155-0000AB08826A'
select * from Specification where ContentManagerId = 'E222C3BB-2DAB-4589-9155-0000AB08826A'
select erpnumber,* from product where id = '95B1D8B9-87FD-E711-A98C-A3E0F1200094'


select * from Content where ContentManagerId in (
select Id from ContentManager
where Id in (
select ContentManagerId from Specification where ProductId in (select Id from Product where ERPNumber like '%:%')
))

select * from ContentManager
where Id in (
select ContentManagerId from Specification where ProductId in (select Id from Product where ERPNumber like '%:%')
)

select * from Specification where ProductId in (select Id from Product where ERPNumber like '%:%')

select * from Product where id = 'a9cd38a9-dd0b-e811-a98c-a3e0f1200094'