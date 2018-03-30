
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLOrderHistory_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLOrderHistory_FromOEG
GO

create procedure ETLOrderHistory_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;


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
		isnull(sho.ord_WebOrderNum,sho.ord_Number) [WebOrderNumber],
		isnull(sho.ord_WebOrderDateTime,sho.ord_Date) [OrderDate],
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
	




/*
exec ETLOrderHistory_FromOEG


*/

end


