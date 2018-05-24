
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
		left(co.BTCity,50), left(BTState.Abbreviation,2), left(co.BTPostalCode,10), left(BTCountry.Abbreviation,50), left(co.BTPhone,3), 
		right(co.BTPhone, 7), left(co.BTEmail,100), co.CustomerNumber, ''
	from 
		CustomerOrder co
		join State BTState on BTState.Name = co.BTState
		join Country BTCountry on BTCountry.Name = co.BTCountry
	where
		co.[Status] = 'Submitted'
		and not exists (
			select [idStatusCustomer] 
			from OEGSystemStaging.dbo.StatusCustomer
			join State BTState on BTState.Name = co.BTState
			join Country BTCountry on BTCountry.Name = co.BTCountry
			where	co.CustomerNumber = [cst_WebCustomerNumber]
					and	[cst_CntFName] = left(co.BTFirstName,15)
					and [cst_CntLName] = left(co.BTLastName,15)
					and [cst_Company] = left(co.BTCompanyName,35)
					and [cst_Address] = left(co.BTAddress1,30)
					and [cst_Address2] = left(co.BTAddress2,30)
					and [cst_Suite] = left(co.BTAddress3,5)
					and [cst_POBox] = left(co.BTAddress4,15)
					and [cst_City] = left(co.BTCity,50)
					and [cst_State] = left(BTState.Abbreviation,2)
					and [cst_ZipCode] = left(co.BTPostalCode,10)
					and [cst_Country] = left(BTCountry.Abbreviation,50)
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
		left(co.STCity,50), left(STState.Abbreviation,2), left(co.STPostalCode,10), left(STCountry.Abbreviation,50), left(co.STPhone,3), 
		right(co.STPhone, 7), left(co.STEmail,100), co.CustomerNumber, ''
	from 
		CustomerOrder co
		join State STState on STState.Name = co.STState
		join Country STCountry on STCountry.Name = co.STCountry
	where
		co.[Status] = 'Submitted'
		and not exists (
			select [idStatusCustomer] 
			from OEGSystemStaging.dbo.StatusCustomer
			join State STState on STState.Name = co.STState
			join Country STCountry on STCountry.Name = co.STCountry
			where	co.CustomerNumber = [cst_WebCustomerNumber]
					and	[cst_CntFName] = left(co.STFirstName,15)
					and [cst_CntLName] = left(co.STLastName,15)
					and [cst_Company] = left(co.STCompanyName,35)
					and [cst_Address] = left(co.STAddress1,30)
					and [cst_Address2] = left(co.STAddress2,30)
					and [cst_Suite] = left(co.STAddress3,5)
					and [cst_POBox] = left(co.STAddress4,15)
					and [cst_City] = left(co.STCity,50)
					and [cst_State] = left(STState.Abbreviation,2)
					and [cst_ZipCode] = left(co.STPostalCode,10)
					and [cst_Country] = left(STCountry.Abbreviation,50)
					and [cst_PhoneArea] = left(co.STPhone,3)
					and [cst_Phone] = right(co.STPhone, 7)
					and [cst_EmailAddr] = left(co.STEmail,100)
			)


	-- now go back and update GUIDs where they are blank
	update OEGSystemStaging.dbo.StatusCustomer set cst_ID = newid() where cst_ID = ''

	
	-- INSERT into StatusOrder


	;with orderdCCT as
	(
		SELECT Id, CustomerOrderId, AuthCode, Amount, CreditCardNumber, ExpirationDate, row_number() 
		over (partition by CustomerOrderId order by Amount desc) as RowNumber
		FROM CreditCardTransaction
		where CustomerOrderId is not null and Result = 0
	),
	maxCCT as
	(
		select CustomerOrderId, Amount, AuthCode, CreditCardNumber, ExpirationDate from orderdCCT where RowNumber = 1
	)
	insert into OEGSystemStaging.dbo.StatusOrder
	(
		[BasketID], [ord_WebNumber], [ord_CustNumber], [ord_Status], [ord_DateTime], [ord_BillToID], [ord_ShipToID], [ord_SourceCode],
		[ord_Amount], [ord_CCAmount], [ord_PONumber], [ord_Delivery], [ord_SalesTax], [ord_ServiceCharge], [ord_SiteID], [ord_GSADiscountPercent],
		[ord_PaymentType], 
		[ord_PaymentToken], 
		[ord_PPToken], 
		[ord_PPPayerID],
		[ord_CCNumber],
		[ord_CCExpire]
	)
	select 
		1, co.OrderNumber, left(co.CustomerNumber,10), 'P', co.OrderDate, bt.cst_ID, st.cst_ID, '99',
		co.OrderTotal, isnull(maxCCT.Amount,0) [ord_CCAmount], left(co.CustomerPO,32), co.ShippingCharges, co.TaxAmount, co.OtherCharges, '1', 0,
		case when TermsCode = 'Open_Credit' then 'oc' else 'cc' end [ord_PaymentType],
		TermsCode [ord_PaymentToken],
		'' [ord_PPToken],
		'' [ord_PPPayerID],
		left(maxCCT.CreditCardNumber,16) [ord_CCNumber],
		left(maxCCT.ExpirationDate,4) [ord_CCExpire]
	from 
		CustomerOrder co
		left join maxCCT on maxCCT.CustomerOrderId = co.Id
		join State BTState on BTState.Name = co.BTState
		join Country BTCountry on BTCountry.Name = co.BTCountry
		join OEGSystemStaging.dbo.StatusCustomer bt on bt.cst_WebCustomerNumber = co.CustomerNumber
					and	bt.[cst_CntFName] = left(co.BTFirstName,15)
					and bt.[cst_CntLName] = left(co.BTLastName,15)
					and bt.[cst_Company] = left(co.BTCompanyName,35)
					and bt.[cst_Address] = left(co.BTAddress1,30)
					and bt.[cst_Address2] = left(co.BTAddress2,30)
					and bt.[cst_Suite] = left(co.BTAddress3,5)
					and bt.[cst_POBox] = left(co.BTAddress4,15)
					and bt.[cst_City] = left(co.BTCity,50)
					and bt.[cst_State] = left(BTState.Abbreviation,2)
					and bt.[cst_ZipCode] = left(co.BTPostalCode,10)
					and bt.[cst_Country] = left(BTCountry.Abbreviation,50)
					and bt.[cst_PhoneArea] = left(co.BTPhone,3)
					and bt.[cst_Phone] = right(co.BTPhone, 7)
					and bt.[cst_EmailAddr] = left(co.BTEmail,100)
		join State STState on STState.Name = co.STState
		join Country STCountry on STCountry.Name = co.STCountry
		join OEGSystemStaging.dbo.StatusCustomer st on st.cst_WebCustomerNumber = co.CustomerNumber
					and	st.[cst_CntFName] = left(co.STFirstName,15)
					and st.[cst_CntLName] = left(co.STLastName,15)
					and st.[cst_Company] = left(co.STCompanyName,35)
					and st.[cst_Address] = left(co.STAddress1,30)
					and st.[cst_Address2] = left(co.STAddress2,30)
					and st.[cst_Suite] = left(co.STAddress3,5)
					and st.[cst_POBox] = left(co.STAddress4,15)
					and st.[cst_City] = left(co.STCity,50)
					and st.[cst_State] = left(STState.Abbreviation,2)
					and st.[cst_ZipCode] = left(co.STPostalCode,10)
					and st.[cst_Country] = left(STCountry.Abbreviation,50)
					and st.[cst_PhoneArea] = left(co.STPhone,3)
					and st.[cst_Phone] = right(co.STPhone, 7)
					and st.[cst_EmailAddr] = left(co.STEmail,100)	
	where
		co.[Status] = 'Submitted'
		and co.TermsCode != 'po'
		and co.OrderDate > '2018-04-19'
		and not exists (
				select idStatusOrder 
				from  OEGSystemStaging.dbo.StatusOrder
				where [ord_WebNumber]  = co.OrderNumber
				)


	-- INSERT into StatusLinkShare
	insert into OEGSystemStaging.dbo.StatusLinkShare
		([dtDateEntered], [SiteID], [OrderID])
	select 
		ord_DateTime, 'test123', idStatusOrder 
	from OEGSystemStaging.dbo.StatusOrder tso 
	where left([ord_WebNumber],1) in ('d','q','s','w')
	and not exists (select LinkShareID from OEGSystemStaging.dbo.StatusLinkShare where OrderID = tso.idStatusOrder)
	
	
	-- INSERT into StatusOrderPayment

	;with orderdCCT as
	(
		SELECT Id, CustomerOrderId, AuthCode, Amount, TransactionDate,  row_number() 
		over (partition by CustomerOrderId order by Amount desc) as RowNumber
		FROM CreditCardTransaction
		where CustomerOrderId is not null and Result = 0
	),
	otherCCT as
	(
		select Id, CustomerOrderId, Amount, AuthCode, TransactionDate from orderdCCT where RowNumber > 1
	)
	insert into OEGSystemStaging.dbo.StatusOrderPayment
	(
		[idStatusOrder], [Status], [TransactionDate],
		[Amount], 
		[PaymentType], 
		[PaymentToken], 
		[PayPalId],
		[PaymentDescription]
	)
	select 
		so.idStatusOrder, 'P' [Status], otherCCT.TransactionDate [TransactionDate],
		convert(decimal(10,2),isnull(otherCCT.Amount,0)) [Amount],
		case when TermsCode = 'Open_Credit' then 'oc' else 'cc' end [PaymentType],
		convert(varchar(50),isnull(otherCCT.AuthCode,'')) [PaymentToken],
		convert(varchar(50), '') [PayPalId],
		convert(varchar(256),otherCCT.Id) [PaymentDescription]
	from 
		CustomerOrder co
		join otherCCT on otherCCT.CustomerOrderId = co.Id
		join OEGSystemStaging.dbo.StatusOrder so on so.ord_WebNumber = co.OrderNumber
	where
		co.[Status] = 'Submitted'
		and not exists (
				select ID 
				from  OEGSystemStaging.dbo.StatusOrderPayment
				where [PaymentDescription] = convert(varchar(256),otherCCT.Id)
				)



	-- INSERT into StatusVendorOrder
	
	insert into OEGSystemStaging.dbo.StatusVendorOrder
	(
		[idStatusOrder], [vo_WebNumber], [vo_VendorCode], [vo_Freight]
	)
	select
		distinct so.idStatusOrder, co.Id, left(s.Value,3), 0
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


	-- INSERT into StatusVendorOrderDetail


	insert into OEGSystemStaging.dbo.StatusVendorOrderDetail
	(
		[idStatusVendorOrder],[vd_WebNumber], [vd_VendorCode], [vd_ItemNum], [vd_ItemName],
		[vd_Options], [vd_SkuNum], [vd_Quantity], [vd_ActualPrice], [vd_Freight], [vd_InsideDelivery],
		[vd_ListPrice], [vd_SwatchGroupName]
		
	)
	select
		svo.idStatusVendorOrder, co.Id, left(s.Value,3), parentP.ERPNumber, p.ShortDescription,
		p.ManufacturerItem, p.Sku, ol.QtyOrdered, ol.UnitNetPrice, p.ShippingAmountOverride, 0,
		ol.UnitListPrice, p.Name
	from 
		CustomerOrder co
		join OrderLine ol on ol.CustomerOrderId = co.Id
		join Product p on p.Id = ol.ProductId
		join Product parentP on parentP.Id = p.StyleParentId
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
select * from OEGSystemStaging.dbo.StatusOrder where left([ord_WebNumber],1) in ('d','q','s','w')
select * from OEGSystemStaging.dbo.StatusOrderPayment
select * from OEGSystemStaging.dbo.StatusLinkShare where [OrderID] in (select idStatusOrder from OEGSystemStaging.dbo.StatusOrder where left([ord_WebNumber],1) in ('d','q','s','w')) 
select * from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
select * from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not null

delete from OEGSystemStaging.dbo.StatusCustomer where [cst_WebCustomerNumber] is not null
delete from OEGSystemStaging.dbo.StatusOrder where left([ord_WebNumber],1) in ('d','q','s','w')
delete from OEGSystemStaging.dbo.StatusOrderPayment 
delete from OEGSystemStaging.dbo.StatusLinkShare where [OrderID] in (select idStatusOrder from OEGSystemStaging.dbo.StatusOrder where left([ord_WebNumber],1) in ('d','q','s','w')) 
delete from OEGSystemStaging.dbo.StatusVendorOrder  where [vo_WebNumber] is not null
delete from OEGSystemStaging.dbo.StatusVendorOrderDetail where [vd_WebNumber] is not null

*/

end


