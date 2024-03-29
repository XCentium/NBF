USE [NBF]
GO
/****** Object:  StoredProcedure [dbo].[p_sc_CalculateFreightTotals]    Script Date: 12/20/2017 11:07:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[p_sc_CalculateFreightTotals](
	@BasketOID int,
	@ItemKindOID int
)
as

set nocount on
/*
--for testing
declare @BasketOID int
set @BasketOID = 536
declare @ItemKindOID int
set @ItemKindOID = 1
*/
if @ItemKindOID = 1
begin
	declare @decMinTruck decimal(10,2), @decUPSMinimum decimal(10,2), 
  		@decUPSOversizeCharge decimal(10,2), @decChangetoWeightBasedFreight decimal(10,2),
  		@decLowMerchAmountWBF DECIMAL(10,2), @decHighMerchAmountWBF  DECIMAL(10,2),
  		@decShippingPricePerPound DECIMAL(10,2)
  		
	declare @isTruckOrder bit, @isOversize bit
	declare @totalFreight decimal(10,2), @tempTotalFreight decimal(10,2)
	declare @freightdiscpercent decimal(10,2), @freightdisc decimal(10,2), @totalfreightdisc decimal(10,2) 
	
	--added for changing how freight is calculated > the value in @decChangeFreightCalc
	DECLARE @vendorWeight DECIMAL(10,2)
	DECLARE @merchTotal DECIMAL(10,2)
	DECLARE @vendorMerchTotal DECIMAL(10,2)
	declare @merchdisc decimal(10,4)
	declare @merchDiscPercent decimal(10,4)
	

	--get the values
	 set @decMinTruck = (select decValue from Shippingcontrols where chrControlType = 'MTA')
	 set @decUPSMinimum = (select decValue from Shippingcontrols where chrControlType= 'UMC')
	 set @decUPSOversizeCharge = (select decValue from Shippingcontrols where chrControlType= 'UOC')
	set @decChangetoWeightBasedFreight = (select decValue from Shippingcontrols where chrControlType= 'WBF')
	set @decLowMerchAmountWBF = (select decValue from Shippingcontrols where chrControlType= 'LMA')
	set @decHighMerchAmountWBF = (select decValue from Shippingcontrols where chrControlType= 'HMA')
	set @decShippingPricePerPound = (select decValue from Shippingcontrols where chrControlType= 'SPP')

	set @totalFreight = 0
	set @totalfreightdisc = 0

	--update freight values in the basket table to match (in case they have changed)
	update sc_BasketItem set ShippingPrice = (select pdw_Freight from ProductDW P where P.pdw_ProductOID = sc_BasketItem.ItemOID)
	where BasketOID = @BasketOID

	--get the items for this basket with some necessary fields
	select T.*, psv_ShipType, pdw_MoveToTruck, pdw_Weight 
	into #tempbasket 
	from sc_BasketItem T
	inner join ProductSkuVendorDW PS on T.ItemOID = PS.psv_ProductOID and T.OptionNum = psv_OptionNum
	inner join ProductDW P on T.ItemOID = P.pdw_ProductOID
	where BasketOID = @BasketOID
	
	--get the merchtotal for the basket.  This decides how to calculate freight
	SET @merchTotal = (SELECT merchtotal FROM dbo.sc_Basket WHERE BasketOID = @BasketOID)
	--get the total discount so can discount the vendor totals
	SET @merchdisc = (SELECT MerchDiscount FROM dbo.sc_Basket WHERE BasketOID = @BasketOID)
	--calculate the discount % -  
	SET @merchDiscPercent = @merchdisc / @merchTotal
	PRINT @merchDiscPercent
	
	--get the vendor orders
	declare @vendorcode varchar(3)
	DECLARE vendor_cursor CURSOR FOR
	  SELECT distinct VendorCode from #tempbasket
	OPEN vendor_cursor
	FETCH NEXT FROM vendor_cursor
	INTO @vendorcode
	-- Check @@FETCH_STATUS to see if there are any more rows to fetch.
	WHILE @@FETCH_STATUS = 0
	BEGIN
		--if one is truck delivery, they all are
		if (select count(*) from #tempbasket T 
			where T.VendorCode = @vendorCode and psv_ShipType = 'T') > 0 
		begin
				set @isTruckOrder = 1
				update sc_BasketItem set ShippingMethod = 'T' where BasketOID = @BasketOID and VendorCode = @vendorCode

		end
		else
		begin	
				--check to see if there are any items that switch to truck above a certain amount
				--and that their total quantity is above that amount.
				/*if (select count(*) from #tempBasket T
					where T.pdw_MoveToTruck is not null
					and VendorCode = @VendorCode
					group by ItemOID, VendorCode, T.pdw_MoveToTruck
					having pdw_MoveToTruck < sum(Quantity)
				) > 0 */
				if exists(select ItemOID from #tempBasket T
					where T.pdw_MoveToTruck is not null
					and VendorCode = @VendorCode
					group by ItemOID, VendorCode, T.pdw_MoveToTruck
					having pdw_MoveToTruck <= sum(Quantity)
				) 
				begin
						set @isTruckOrder = 1
						update sc_BasketItem set ShippingMethod = 'T' where BasketOID = @BasketOID and VendorCode = @vendorCode
				end
				else
				begin
					--just plain ups
					set @isTruckOrder = 0
					update sc_BasketItem set ShippingMethod = 'N' where BasketOID = @BasketOID and VendorCode = @vendorCode
				end
		END
		IF @merchTotal < @decChangetoWeightBasedFreight --added 5/3/12 for calculating freight over a certain merch amount
		BEGIN
			--use standard freight rules
			if @isTruckOrder = 1
			begin
				set @tempTotalFreight = (select sum(ShippingPrice*Quantity) from #tempbasket where VendorCode = @vendorCode)
				--check if less than minimum truck freight, but not = 0
				if @tempTotalFreight < @decMinTruck and @tempTotalFreight > 0
					set @tempTotalFreight = @decMinTruck
				
			end
			else --ups issues
			begin
				set @tempTotalFreight = (select sum(ShippingPrice*Quantity) from #tempbasket T where T.VendorCode = @vendorCode)
				
				if @tempTotalFreight > 0 -- more than 0 so min applies
				begin
					--check oversize
					/*if (select count(*) from #tempbasket T 
						inner join ProductSkuVendorDW P on T.ItemOID = P.psv_ProductOID 
						where T.VendorCode = @vendorCode and P.psv_Oversize = 1) > 0
					begin
						if @tempTotalFreight < @decUPSOversizeCharge 
							set @tempTotalFreight = @decUPSOversizeCharge
					end
					else --just use ups min
					begin*/
						if @tempTotalFreight < @decUPSMinimum
							set @tempTotalFreight= @decUPSMinimum
					/*end*/
				end
			end
			--get the discount by vendor if any
				set @freightdiscpercent = (select discPercent from bc_FreightDiscount
					where FromValue <= @tempTotalFreight and @tempTotalFreight <= ToValue)
				if @freightdiscpercent is null
					set @freightdiscpercent = 0
				--calculate discount
				set @freightdisc = @tempTotalFreight * @freightdiscpercent
				set @totalfreightdisc = @totalfreightdisc + @freightdisc
		END
		ELSE
		BEGIN
		
			set @tempTotalFreight = (select sum(ShippingPrice*Quantity) from #tempbasket T where T.VendorCode = @vendorCode)
			IF @tempTotalFreight > 0 --only if not 0 freight
			BEGIN		
				--use new freight rules
				--get the vendor merch total for reference
				SET @vendorMerchTotal = (SELECT SUM(quantitytotal) FROM #tempbasket WHERE VendorCode = @vendorcode)
				--discount the total
				SET @vendorMerchTotal = @vendorMerchTotal * (1.00 - @merchDiscPercent)
				PRINT @vendorMerchTotal
				
				DECLARE @lowestFreight AS DECIMAL(10,2)
				DECLARE @highestFreight AS DECIMAL(10,2)
				SET @lowestFreight = @decLowMerchAmountWBF * @vendorMerchTotal
				SET @highestFreight = @decHighMerchAmountWBF * @vendorMerchTotal
				
				--get the weight of the items
				SET @vendorWeight = (SELECT SUM(pdw_Weight * CAST(Quantity AS DECIMAL)) from #tempbasket WHERE VendorCode = @vendorcode)
				
				--set the freight to the price per pound
				SET @tempTotalFreight = @vendorWeight * @decShippingPricePerPound
				
				--check the values to make sure not too low or too high
				IF @tempTotalFreight < @lowestFreight
				BEGIN
					SET @tempTotalFreight = @lowestFreight
				END
				ELSE IF @tempTotalFreight > @highestFreight
				BEGIN
					SET @tempTotalFreight = @highestFreight
				END
				
				--set the default in case if truck
				if @isTruckOrder = 1
				BEGIN
					IF @tempTotalFreight < @decMinTruck
					BEGIN
						SET @tempTotalFreight = @decMinTRuck
					END
				END
			END
		END
					
				set @totalFreight = @totalFreight + @tempTotalFreight 

	FETCH NEXT FROM vendor_cursor
	  INTO @vendorcode
	END
	CLOSE vendor_cursor
	DEALLOCATE vendor_cursor

	--update basket with freight
	update sc_Basket set FreightTotal = @totalFreight, FreightDiscount = @totalfreightdisc where BasketOID = @BasketOID

	drop table #tempbasket
end
else
begin
--swatches only
--update the swatches
	update sc_BasketITem set 
		ShippingMethod = 'N',
		ShippingPrice = 0.00
	where BAsketOID = @BAsketOID
	
	update sc_Basket set 
		FreightTotal = 0.00, 
		FreightDiscount = 0.00 
	where BasketOID = @BasketOID
end

