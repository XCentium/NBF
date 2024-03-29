USE [NBF]
GO
/****** Object:  StoredProcedure [dbo].[p_sc_CalculateFOB]    Script Date: 12/20/2017 11:07:12 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[p_sc_CalculateFOB](
	@BasketOID int
)
as

set nocount on

--for testing
/*declare @BasketOID int
set @BasketOID = 282
*/
if exists(select BasketOID from sc_Basket where  BasketOID = @BasketOID and IsFOB = 1)
begin
	declare @totalFreight decimal(10,2)
	set @totalFreight = (select FreightTotal - FreightDiscount from sc_Basket where BasketOID = @BasketOID)
	declare @totalMerch decimal(10,2)
	--set @totalMerch = (select MerchTotal from sc_Basket where BasketOID = @BasketOID)
	--changed to only include merch that does not have 0 freight
	SET @totalMerch = (SELECT SUM(quantitytotal) FROM dbo.sc_BasketItem WHERE BasketOID = @BasketOID
						AND ShippingPrice > 0)
						PRINT @totalFreight
						print @totalMerch
					

	create table #tempFreight(
		BasketItemOID int,
		QuantityPrice decimal(10,2),
		MerchPercent decimal(10,4),
		FreightToApply decimal (10,2),
		FOBPrice decimal(10,2)
	)
	insert into #tempFreight
	select BasketItemOID,
			QuantityTotal,
			QuantityTotal/@totalMerch,
			0.00,
			0.00
	from sc_BasketItem where BasketOID = @BasketOID
	AND ShippingPrice > 0
	

	update #tempFreight set FreightToApply = dbo.f_BankersRound(@totalFreight*MerchPercent)
	--SELECT * FROM #tempFreight

	declare @tempTotalFreight decimal(10,2)
	set @tempTotalFreight = (select sum(FreightToApply) from #tempFreight)

	--if less...
	if (@tempTotalFreight <> @totalFreight)
	begin
		declare @difference decimal(10,2)
		declare @amount decimal(10,2)
		set @difference = @totalFreight - @tempTotalFreight
		if (@tempTotalFreight < @totalFreight)
		begin
			set @amount = .01
		end
		else
		begin
			set @amount = -.01
		end

		while (@difference <> 0)
		begin
			--go through the items, adding pennies as we go
			declare @itemOID int
			DECLARE item_cursor CURSOR FOR
			  SELECT distinct BasketItemOID from #tempFreight
			OPEN item_cursor
			FETCH NEXT FROM item_cursor
			INTO @itemOID
			WHILE @@FETCH_STATUS = 0
			BEGIN
				--ADD/subtract A PENNY
				update #tempFreight set FreightToApply = FreightToApply + @amount where BasketItemOID = @itemOID
				
				--subtract/add a penny from the difference
				set @difference = @difference - @amount

				--if we've gotten to 0, get out of the loop
				if (@difference = 0)
					break
				Else
					continue
			FETCH NEXT FROM item_cursor
			  INTO @itemOID
			END
			CLOSE item_cursor
			DEALLOCATE item_cursor
		end
	end

	update #tempFreight set FOBPrice = QuantityPrice + FreightToApply
--SELECT * FROM #tempFreight


	update SC_BasketItem
		set 
		FOBPriceTotal = (select FOBPrice from #tempFreight where SC_BasketItem.BasketItemOID = #tempFreight.BasketItemOID),
		FOBFreightApplied = (select FreightToApply from #tempFreight where SC_BasketItem.BasketItemOID = #tempFreight.BasketItemOID)
		where BasketOID = @BasketOID

	--select * from SC_BasketItem where BasketOID = @BasketOID

	update SC_BasketItem set FOBPrice = dbo.f_BankersRound(FOBPriceTotal/cast(Quantity as decimal))
		where BasketOID = @BasketOID
		
		--update the free shipping items
		update SC_BasketItem set FOBPrice = QuantityPrice, FOBPriceTotal = QuantityTotal, FOBFreightApplied = 0.00
		where BasketOID = @BasketOID AND ShippingPrice =0

	--update basket table
	update SC_Basket set FOBFreight = 0.00 where BasketOID = @BasketOID
	update SC_Basket set FOBTotal = (select sum(FOBPriceTotal) from sc_BasketItem where BasketOID = @BasketOID) where BasketOID = @BasketOID

	--select * from SC_BasketItem where BasketOID = @BasketOID

	drop table #tempFreight
end
else
begin
	--clear out the values
	update SC_Basket set FOBTotal = 0.00 where BasketOID = @BasketOID
end
