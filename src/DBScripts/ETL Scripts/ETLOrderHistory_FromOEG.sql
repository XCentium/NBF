
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLOrderHistory_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLOrderHistory_FromOEG
GO

create procedure ETLOrderHistory_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;


	-- first do some updates

	update OrderHistory set
		WebOrderNumber = isnull(sho.ord_WebOrderNum,''),
		OrderDate = convert(date,isnull(sho.ord_WebOrderDateTime,sho.ord_Date)),
		[Status] = isnull(sho.ord_Status ,''),
		OrderTotal = isnull(sho.ord_Amount,0)
	from 
		OEGSystemStaging.dbo.HistoryOrder sho
		join OrderHistory oh on oh.ERPOrderNumber = sho.ord_Number
	where
		oh.WebOrderNumber != isnull(sho.ord_WebOrderNum,'')
		or oh.OrderDate != convert(date,isnull(sho.ord_WebOrderDateTime,sho.ord_Date))
		or oh.[Status] != isnull(sho.ord_Status ,'')
		or oh.OrderTotal != isnull(sho.ord_Amount,0)

	-- now insert

	insert into OrderHistory
	(
		ERPOrderNumber,
		WebOrderNumber,
		OrderDate,
		[Status],
		CustomerNumber,
		CustomerPO,

		BTCompanyName,
		BTAddress1,
		BTAddress2,
		BTCity,
		BTState,
		BTPostalCode,
		BTCountry,

		STCompanyName,
		STAddress1,
		STAddress2,
		STCity,
		STState,
		STPostalCode,
		STCountry,

		OrderTotal,
		CreatedBy,
		ModifiedBy

	) 
	select 
		distinct sho.ord_Number ERPOrderNumber,
		isnull(sho.ord_WebOrderNum,'') [WebOrderNumber],
		convert(date,isnull(sho.ord_WebOrderDateTime,sho.ord_Date)) [OrderDate],
		isnull(sho.ord_Status ,'') [Status],
		isnull(shcBT.cst_Number,'') [CustomerNumber],
		isnull(sho.ord_CustPO,'') [CustomerPO],

		isnull(shcBT.cst_Company,'') [BTCompanyName],
		isnull(shcBT.cst_Address,'') [BTAddress1],
		isnull(shcBT.cst_Suite,'') [BTAddress2],
		isnull(shcBT.cst_City,'') [BTCity],
		isnull(shcBT.cst_State,'') [BTState],
		isnull(shcBT.cst_ZipCode,'') [BTPostalCode],
		isnull(shcBT.cst_Country,'') [BTCountry],

		isnull(shcST.cst_Company,'') [STCompanyName],
		isnull(shcST.cst_Address,'') [STAddress1],
		isnull(shcST.cst_Suite,'') [STAddress2],
		isnull(shcST.cst_City,'') [STCity],
		isnull(shcST.cst_State,'') [STState],
		isnull(shcST.cst_ZipCode,'') [STPostalCode],
		isnull(shcST.cst_Country,'') [STCountry],

		isnull(sho.ord_Amount,0) [OrderTotal],

		'etl', 'etl'
	from
		OEGSystemStaging.dbo.HistoryOrder sho
		join OEGSystemStaging.dbo.HistoryCustomer shcBT on shcBT.cst_Number = sho.ord_BillTo
		left join OEGSystemStaging.dbo.HistoryCustomer shcST on shcST.cst_Number = sho.ord_ShipTo
	where 
		not exists (select Id from OrderHistory where ERPOrderNumber = sho.ord_Number) 



	;with ShipAndTax as
	(
		select 
			oh.ERPOrderNumber,
			sum(shvo.vo_Freight) [ShippingCharges],
			sum(shvo.vo_TaxAmount) [TaxAmount]
		from 
			OEGSystemStaging.dbo.HistoryOrder sho
			join OrderHistory oh on oh.ERPOrderNumber = sho.ord_Number
			join OEGSystemStaging.dbo.HistoryVendorOrder shvo on shvo.vo_OrderNum = sho.ord_Number
		group by
			oh.ERPOrderNumber
	)
	update OrderHistory set
		[ShippingCharges] = st.ShippingCharges,
		[TaxAmount] = st.TaxAmount
	from 
		OrderHistory oh 
		join ShipAndTax st on st.ERPOrderNumber = oh.ERPOrderNumber
	where
		oh.[ShippingCharges] != st.ShippingCharges
		or oh.[TaxAmount] != st.TaxAmount




/*
exec ETLOrderHistory_FromOEG
select * from OrderHistory

*/

end


