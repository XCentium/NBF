
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLOrder_ToOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLOrder_ToOEG
GO

create procedure ETLOrder_ToOEG 
as
begin


	insert into OEGSystemStaging.dbo.StatusCustomer 
	(
		[cst_CntFName], [cst_CntLName], [cst_Company], [cst_Address], [cst_Address2], 
		[cst_Suite], [cst_POBox],
		[cst_City], [cst_State], [cst_ZipCode], [cst_Country], [cst_PhoneArea], 
		[cst_Phone], [cst_EmailAddr], [cst_WebCustomerNumber], [cst_ID]
	)
	select distinct
		left(co.BTFirstName,15), left(co.BTLastName,15), left(co.BTCompanyName,35), left(co.BTAddress1,30), left(co.BTAddress2,30), 
		left(co.BTAddress3,5), left(co.BTAddress4,15),
		left(co.BTCity,50), left(co.BTState,2), left(co.BTPostalCode,10), left(co.BTCountry,50), left(co.BTPhone,3), 
		right(co.BTPhone, 7), left(co.BTEmail,100), co.CustomerNumber, ''
	from 
		CustomerOrder co
	where
		co.[Status] = 'Submitted'
		and not exists (
			select [idStatusCustomer] 
			from OEGSystemStaging.dbo.StatusCustomer
			where	co.CustomerNumber = [cst_WebCustomerNumber]
					and	[cst_CntFName] = left(co.BTFirstName,15)
					and [cst_CntLName] = left(co.BTLastName,15)
					and [cst_Company] = left(co.BTCompanyName,35)
					and [cst_Address] = left(co.BTAddress1,30)
					and [cst_Address2] = left(co.BTAddress2,30)
					and [cst_Suite] = left(co.BTAddress3,5)
					and [cst_POBox] = left(co.BTAddress4,15)
					and [cst_City] = left(co.BTCity,50)
					and [cst_State] = left(co.BTState,2)
					and [cst_ZipCode] = left(co.BTPostalCode,10)
					and [cst_Country] = left(co.BTCountry,50)
					and [cst_PhoneArea] = left(co.BTPhone,3)
					and [cst_Phone] = right(co.BTPhone, 7)
					and [cst_EmailAddr] = left(co.BTEmail,100)
			)

	insert into OEGSystemStaging.dbo.StatusCustomer 
	(
		[cst_CntFName], [cst_CntLName], [cst_Company], [cst_Address], [cst_Address2], 
		[cst_Suite], [cst_POBox],
		[cst_City], [cst_State], [cst_ZipCode], [cst_Country], [cst_PhoneArea], 
		[cst_Phone], [cst_EmailAddr], [cst_WebCustomerNumber], [cst_ID]
	)
	select distinct
		left(co.STFirstName,15), left(co.STLastName,15), left(co.STCompanyName,35), left(co.STAddress1,30), left(co.STAddress2,30), 
		left(co.STAddress3,5), left(co.STAddress4,15),
		left(co.STCity,50), left(co.STState,2), left(co.STPostalCode,10), left(co.STCountry,50), left(co.STPhone,3), 
		right(co.STPhone, 7), left(co.STEmail,100), co.CustomerNumber, ''
	from 
		CustomerOrder co
	where
		co.[Status] = 'Submitted'
		and not exists (
			select [idStatusCustomer] 
			from OEGSystemStaging.dbo.StatusCustomer
			where	co.CustomerNumber = [cst_WebCustomerNumber]
					and	[cst_CntFName] = left(co.STFirstName,15)
					and [cst_CntLName] = left(co.STLastName,15)
					and [cst_Company] = left(co.STCompanyName,35)
					and [cst_Address] = left(co.STAddress1,30)
					and [cst_Address2] = left(co.STAddress2,30)
					and [cst_Suite] = left(co.STAddress3,5)
					and [cst_POBox] = left(co.STAddress4,15)
					and [cst_City] = left(co.STCity,50)
					and [cst_State] = left(co.STState,2)
					and [cst_ZipCode] = left(co.STPostalCode,10)
					and [cst_Country] = left(co.STCountry,50)
					and [cst_PhoneArea] = left(co.STPhone,3)
					and [cst_Phone] = right(co.STPhone, 7)
					and [cst_EmailAddr] = left(co.STEmail,100)
			)


	insert into OEGSystemStaging.dbo.StatusOrder
	(
		[ord_WebNumber], [ord_CustNumber], [ord_Status], [ord_DateTime], [ord_BillToID], [ord_ShipToID],
		[ord_Amount], [ord_PONumber], [ord_Delivery], [ord_SalesTax], [ord_ServiceCharge], [ord_SiteID]
	)
	select 
		co.OrderNumber, left(co.CustomerNumber,10), left(co.Status,1), co.OrderDate, bt.idStatusCustomer, st.idStatusCustomer,
		co.OrderTotal, left(co.CustomerPO,32), co.ShippingCharges, co.TaxAmount, co.OtherCharges, 'NBF'
	from 
		CustomerOrder co
		join OEGSystemStaging.dbo.StatusCustomer bt on bt.cst_WebCustomerNumber = co.CustomerNumber
					and	bt.[cst_CntFName] = left(co.BTFirstName,15)
					and bt.[cst_CntLName] = left(co.BTLastName,15)
					and bt.[cst_Company] = left(co.BTCompanyName,35)
					and bt.[cst_Address] = left(co.BTAddress1,30)
					and bt.[cst_Address2] = left(co.BTAddress2,30)
					and bt.[cst_Suite] = left(co.BTAddress3,5)
					and bt.[cst_POBox] = left(co.BTAddress4,15)
					and bt.[cst_City] = left(co.BTCity,50)
					and bt.[cst_State] = left(co.BTState,2)
					and bt.[cst_ZipCode] = left(co.BTPostalCode,10)
					and bt.[cst_Country] = left(co.BTCountry,50)
					and bt.[cst_PhoneArea] = left(co.BTPhone,3)
					and bt.[cst_Phone] = right(co.BTPhone, 7)
					and bt.[cst_EmailAddr] = left(co.BTEmail,100)
		join OEGSystemStaging.dbo.StatusCustomer st on st.cst_WebCustomerNumber = co.CustomerNumber
					and	st.[cst_CntFName] = left(co.STFirstName,15)
					and st.[cst_CntLName] = left(co.STLastName,15)
					and st.[cst_Company] = left(co.STCompanyName,35)
					and st.[cst_Address] = left(co.STAddress1,30)
					and st.[cst_Address2] = left(co.STAddress2,30)
					and st.[cst_Suite] = left(co.STAddress3,5)
					and st.[cst_POBox] = left(co.STAddress4,15)
					and st.[cst_City] = left(co.STCity,50)
					and st.[cst_State] = left(co.STState,2)
					and st.[cst_ZipCode] = left(co.STPostalCode,10)
					and st.[cst_Country] = left(co.STCountry,50)
					and st.[cst_PhoneArea] = left(co.STPhone,3)
					and st.[cst_Phone] = right(co.STPhone, 7)
					and st.[cst_EmailAddr] = left(co.STEmail,100)	
	where
		co.[Status] = 'Submitted'
		and not exists (
				select idStatusOrder 
				from  OEGSystemStaging.dbo.StatusOrder
				where [ord_WebNumber]  = co.OrderNumber
				)


	
	insert into OEGSystemStaging.dbo.StatusVendorOrder
	(
		[idStatusOrder], [vo_WebNumber], [vo_VendorCode], [vo_Status],
		[vo_Freight]
	)
	select
		distinct so.idStatusOrder, co.Id, left(s.Value,3), left(co.Status,1),
		0
	from 
		CustomerOrder co
		join OrderLine ol on ol.CustomerOrderId = co.Id
		join Product p on p.Id = ol.ProductId
		join Specification s on s.ProductId = p.Id
			and s.[Name] = 'Vendor Code'
		join OEGSystemStaging.dbo.StatusOrder so on so.ord_WebNumber = co.OrderNumber
	where
		co.[Status] = 'Submitted'
		and not exists (
				select idStatusOrder 
				from  OEGSystemStaging.dbo.StatusVendorOrder
				where [vo_WebNumber]  = co.Id
				)


	insert into OEGSystemStaging.dbo.StatusVendorOrderDetail
	(
		[idStatusVendorOrder],[vd_WebNumber], [vd_VendorCode], [vd_ItemNum], [vd_ItemName],
		[vd_Options], [vd_SkuNum], [vd_Quantity], [vd_ActualPrice], [vd_ListPrice], [vd_SwatchGroupName], 
		vd_Freight, [vd_InsideDelivery]
	)
	select
		svo.idStatusVendorOrder, co.Id, left(s.Value,3), p.ERPNumber, p.ShortDescription,
		p.ManufacturerItem, p.Sku, ol.QtyOrdered, ol.UnitNetPrice, ol.UnitRegularPrice, p.Name, 
		0, 0
	from 
		CustomerOrder co
		join OrderLine ol on ol.CustomerOrderId = co.Id
		join Product p on p.Id = ol.ProductId
		join Specification s on s.ProductId = p.Id
			and s.[Name] = 'Vendor Code'
		join OEGSystemStaging.dbo.StatusVendorOrder svo on svo.vo_WebNumber = co.Id
			and svo.vo_VendorCode = left(s.Value,3)
	where
		co.[Status] = 'Submitted'
		and not exists (
				select idStatusOrder 
				from  OEGSystemStaging.dbo.StatusVendorOrderDetail
				where [vd_WebNumber]  = co.Id
				)


/*
ETLOrder_ToOEG
select * from CustomerOrder
select * from OEGSystemStaging.dbo.StatusCustomer where [cst_WebCustomerNumber] is not null
select * from OEGSystemStaging.dbo.StatusOrder where [ord_SiteID] = 'nbf'
select * from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
select * from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not null

*/

end


