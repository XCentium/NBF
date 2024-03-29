USE [NBF]
GO
/****** Object:  StoredProcedure [dbo].[p_sc_CalculateQuantityPricing]    Script Date: 12/20/2017 11:08:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[p_sc_CalculateQuantityPricing](
	@BasketOID int,
	@ItemKindOID int
)
AS

set nocount on
/*
--for testing
declare @BasketOID int
set @BasketOID = 1
declare @ItemKindOID int
set @ItemKindOID = 1
*/
if @ItemKindOID = 1
begin
--get rid of any items that are no longer in the db
delete from sc_BasketItem where 
not exists (select psv_OID from ProductSkuVendorDW
inner join ProductDW on psv_ProductOID = pdw_ProductOID where psv_ProductOID = sc_BasketItem.ITemOID and psv_OptionNum = sc_BasketItem.OptionNum)
and ITemKindOId = @ItemKindOID
and BasketOID = @BasketOID

DECLARE @ContractPriceType VARCHAR(1)
SET @ContractPriceType = (SELECT top 1 pct_PriceType FROM PDB_ContractType INNER JOIN sc_Basket ON 
			ContractTypeOID = pct_OID WHERE BasketOID = @BasketOID)
DECLARE @UsePriceTypeOnly BIT
IF (@ContractPriceType IS NULL)
BEGIN
	SET @UsePriceTypeOnly = 0
END
ELSE
BEGIN
SET @UsePriceTypeOnly = (SELECT top 1 pct_UsePriceTypeOnly FROM PDB_ContractType INNER JOIN sc_Basket ON 
			ContractTypeOID = pct_OID WHERE BasketOID = @BasketOID)
end

--just set the default
IF (@ContractPriceType IS NULL)
BEGIN
	SET @ContractPriceType = 'C'
END


--create temp table
	create table #tempPricing(
		ItemOID nvarchar(255),
		MFGVendorOID int,
		VendorQuantity int,
		quantityPricing decimal(10,2)
	)

	--insert into the temp table
	insert into #tempPricing
	select ItemOID, psv_ManufacturerOID, 0 as VendorQuantity, 0.00 as QuantityPricing
	from SC_BasketItem
	inner join ProductDW on pdw_ProductOID = ItemOID
	inner join ProductSkuVendorDW on psv_ProductOID = ItemOID and psv_OptionNum = OptionNum
	where ItemKindOID  = 1 -- only used for catalog items
	and BasketOID = @BasketOID 
	group by ItemOID, psv_ManufacturerOID

	--get the manufacturing vendor and quantity counts
	update #tempPricing set VendorQuantity = (select sum(Quantity) 
	from SC_BasketItem
	inner join ProductDW on pdw_ProductOID = ItemOID
	inner join ProductSkuVendorDW on psv_ProductOID = ItemOID and psv_OptionNum = OptionNum
	where ItemKindOID  = 1 -- only used for catalog items
	and BasketOID = @BasketOID 
	and ProductSkuVendorDW.psv_ManufacturerOID = #tempPricing.MFGVendorOID)

	
	--select * from #tempPricing
	IF (@UsePriceTypeOnly = 1)
	BEGIN
		update #tempPricing set QuantityPricing = (select top 1 pp_Price from ProductPrice
		where pp_ProductOID = #tempPricing.ItemOID and #tempPricing.VendorQuantity >= pp_Quantity 
		and GETDATE() between pp_EffDate_Start and pp_EffDate_Finish
		and (pp_PriceType=@ContractPriceType) order by pp_Price asc, pp_Quantity desc) 
		--select * from #tempPricing
	END
	ELSE
	begin
		update #tempPricing set QuantityPricing = (select top 1 pp_Price from ProductPrice
		where pp_ProductOID = #tempPricing.ItemOID and #tempPricing.VendorQuantity >= pp_Quantity 
		and GETDATE() between pp_EffDate_Start and pp_EffDate_Finish
		and (pp_PriceType ='C' or pp_PriceType='S' OR pp_PriceType=@ContractPriceType) order by pp_Price asc, pp_Quantity desc) 
		--select * from #tempPricing
	end
	
	update SC_BasketItem
	set QuantityPrice = (select QuantityPricing from #tempPricing where SC_BasketItem.ItemOID = #tempPricing.ItemOID),
	Quantitytotal = Quantity * (select QuantityPricing from #tempPricing where SC_BasketItem.ItemOID = #tempPricing.ItemOID)
	where BasketOID = @BasketOID
	
	drop table #tempPricing
end

