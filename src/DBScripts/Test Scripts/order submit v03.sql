select * from CustomerOrder where Status = 'submitted'
select * from OrderLine where CustomerOrderId in (select Id from CustomerOrder where Status = 'submitted')
select * from CreditCardTransaction

select * from OEGSystemStaging.dbo.StatusOrder where [ord_SiteID] = 'nbf'
select * from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
select * from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not  null

select * from OEGSystemStaging.dbo.StatusCustomer where cst_ID = 'E7D175BB-34C8-4BC3-9D40-2D3005979607'

select  ord_Number,count(*) from OEGSystemStaging.dbo.StatusOrder
--where result=0
group by ord_Number
having count(*) > 1

select * from OEGSystemStaging.dbo.StatusOrder where ord_webNumber = '9341052'

select * from OEGSystemStaging.dbo.StatusCustomer where [cst_WebCustomerNumber] is not null
select * from OEGSystemStaging.dbo.StatusOrder where [ord_SiteID] = 'nbf'
select * from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
select * from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not null

/*
delete from OEGSystemStaging.dbo.StatusCustomer where [cst_WebCustomerNumber] is not null
delete from OEGSystemStaging.dbo.StatusOrder where [ord_SiteID] = 'nbf'
delete from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
delete from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not null
*