SELECT * FROM [Insite.nbf].[dbo].[CustomerOrder] where id = 'FA5B708E-5DF3-4E6C-A0F2-A8960142AC6A'
SELECT * FROM [InsiteETL].[dbo].[CustomerOrder] where id = 'FA5B708E-5DF3-4E6C-A0F2-A8960142AC6A'

select * from [Insite.nbf].dbo.Customer
select * from InsiteETL.dbo.Customer

select ERPNumber, * from Product

select * from [Insite.nbf].dbo.OrderLine where CustomerOrderId = 'FA5B708E-5DF3-4E6C-A0F2-A8960142AC6A'
select * from InsiteETL.dbo.OrderLine where CustomerOrderId = 'FA5B708E-5DF3-4E6C-A0F2-A8960142AC6A'

select * from InsiteETL.dbo.Customer
SELECT * FROM [InsiteETL].[dbo].[CustomerOrder]
select * from InsiteETL.dbo.OrderLine

select  * from Specification where name = 'vendor code' and Value != ''
 where ProductId = '13F7D2C0-87FD-E711-A98C-A3E0F1200094'

--WEB002075
--WEB002077
--Z002004

select top 1000 name,ERPNumber ,* from product

select * from OEGSystemStaging.dbo.StatusCustomer where [cst_WebCustomerNumber] is not null
select * from OEGSystemStaging.dbo.StatusOrder where [ord_SiteID] = 'nbf'
select * from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
select * from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not null