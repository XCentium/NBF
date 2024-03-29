USE [NBF]
GO
/****** Object:  StoredProcedure [dbo].[p_sc_CalculateMerchTotals]    Script Date: 12/20/2017 11:08:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[p_sc_CalculateMerchTotals](
	@BasketOID int
)
AS 

set nocount on

--for testing
/*
declare @BasketOID int
set @BasketOID = 282
*/
declare @promocode varchar(15)
set @promocode = (select promocode from sc_Basket where BasketOID = @BasketOID)


declare @merchtotal decimal(10,2)
--keeping separate for clarity 6/15/16
declare @discnotallowed decimal(10,2)
--selling agreements
DECLARE @allowdiscount BIT 
 

declare @merchdiscpercent decimal(10,4)
declare @merchdisc decimal(10,4)
declare @itemcount INT
declare @gsaDiscount decimal(10,2)

DECLARE @sellingAgreementID int

set @merchtotal = (select sum(Quantitytotal) from sc_BasketItem where BasketOID = @BasketOID)
--keeping separate for clarity 6/15/16
set @discnotallowed = (select sum(Quantitytotal) from sc_BasketItem where BasketOID = @BasketOID and VendorCode in (select vdw_VendorCode from VendorDW where vdw_AllowVolumeDiscount = 0))
if (@discnotallowed is null)
begin
	set @discnotallowed = 0
END

--selling agreements - as of 3/3/17, no more discounts allowed
SET @sellingAgreementID = (SELECT sellingagreementid FROM sc_Basket WHERE BasketOID = @BasketOID)
IF (@sellingAgreementID > 0)
BEGIN
	SET @allowdiscount = 0
END
ELSE
BEGIN
	SET @allowdiscount = 1
END

set @itemcount = (select sum(Quantity) from sc_BasketItem where BasketOID = @BasketOID)

--removed WEB02342 5/24/13
--added back 9/27/16
--BUG01638
--check the promocode for % discounting
declare @allowvolume int
set @allowvolume = (select 1 as Promocode where exists (select pc_OID from promocode inner join promocodedetail
on pc_OID = pcd_Promocodeoid where (pcd_PercentOff is not null and pcd_PercentOff <> 0)
and pc_Promocode = @promocode))

--if (@promocode is null or @promocode = '') --do not use discounting for %off promocodes
if (@allowvolume is null) --do not use discounting for %off promocodes
begin	
set @merchdiscpercent =
	(select discPercent 
	from bc_MerchDiscount 
	where FromValue <= (@merchtotal -@discnotallowed)
	and ToValue >= (@merchtotal-@discnotallowed))
	if @merchdiscpercent is null
		set @merchdiscpercent = 0
end
else
begin
	set @merchdiscpercent = 0
end

if exists(select BasketOID from sc_Basket where BasketOID = @BasketOID and isGSA = 1)
begin
declare @gsaDiscountPercent decimal(10,4)
	
	--get the discount structure code (added for BPA)
declare @DiscountCode varchar(1)
set @DiscountCode = (select pct_PriceType from PDB_ContractType inner join sc_Basket on ContractTypeOID = pct_OID and BasketOID = @BasketOID )
	
	set @gsaDiscount = 0.00
	set @merchdisc = 0.00

	set @gsaDiscountPercent =
	(select Discount/100 
	from OS_Discount 
	where MinMerch <= (@merchtotal-@discnotallowed)
	and MaxMerch >= (@merchtotal-@discnotallowed) and DiscountType = @DiscountCode) --changed to use code
	
	if @gsaDiscountPercent is null
		set @gsaDiscountPercent = 0

	--only do gsa for now, will worry about other contracts later
	declare @BasketItemOID int, @ItemOID int, @Quantity int, @QuantityPrice decimal(10,2), @isGSA bit, @VendorCode varchar(3), @AllowVolumeDiscount bit
	DECLARE item_cursor CURSOR FOR
	--added non volume discount items  6/15/16
			  SELECT BasketItemOID, ItemOID,Quantity,QuantityPrice, pdw_IsGSA, VendorCode,vdw_AllowVolumeDiscount from sc_BasketItem 
			  inner join Productdw on ItemOID = pdw_ProductOID
			  inner join VendorDW on VendorCode = vdw_VendorCode 
					where BasketOID = @BasketOID 
			OPEN item_cursor
			FETCH NEXT FROM item_cursor
			INTO @BasketItemOID, @itemOID, @Quantity, @QuantityPrice, @isGSA, @VendorCode, @AllowVolumeDiscount
			WHILE @@FETCH_STATUS = 0
			BEGIN

				declare @DiscountPrice decimal(10,2)
				declare @DiscountTotal decimal(10,2)
				if (@AllowVolumeDiscount = 1) --allow volume discounts
				begin
					if (@isGSA = 1)
					begin
						set @DiscountPrice = dbo.f_BankersRound(@QuantityPrice*(1-@gsaDiscountPercent))
						set @DiscountTotal = dbo.f_BankersRound(@Quantity * (@QuantityPrice - @DiscountPrice))
						update sc_BasketItem set DiscountPrice = @DiscountPrice where BasketItemOID = @BasketItemOID
						set @gsaDiscount = @gsaDiscount + @DiscountTotal
					end
					else
					begin
						set @DiscountPrice = dbo.f_BankersRound(@QuantityPrice*(1-@merchdiscpercent))
						set @DiscountTotal = dbo.f_BankersRound(@Quantity * (@QuantityPrice - @DiscountPrice))
						update sc_BasketItem set DiscountPrice = @DiscountPrice where BasketItemOID = @BasketItemOID
						set @merchdisc = @merchdisc + @DiscountTotal
					end	
				end 
				else
				begin --no volume discounting allowed
						set @DiscountPrice = @QuantityPrice
						set @DiscountTotal =0
						update sc_BasketItem set DiscountPrice = @DiscountPrice where BasketItemOID = @BasketItemOID
						set @merchdisc = @merchdisc + @DiscountTotal
				end
				
			FETCH NEXT FROM item_cursor
			  INTO @BasketItemOID, @itemOID, @Quantity, @QuantityPrice, @isGSA, @VendorCode, @AllowVolumeDiscount
			END
			CLOSE item_cursor
			DEALLOCATE item_cursor
		if @gsaDiscount is null 
		set @gsaDiscount = 0
		

	update sc_Basket set MerchTotal = @merchtotal, MerchDiscount = @merchdisc  + @gsaDiscount,
			GsaDiscount = @gsaDiscount, GSADiscountPercent = @gsaDiscountPercent, ItemCount = @itemcount
		where BasketOID = @BasketOID
END
ELSE 
BEGIN
--other contracts
	if EXISTS(select BasketOID from sc_Basket where BasketOID = @BasketOID and (isGSA <> 1 OR isGSA IS NULL) AND (ContractTypeOID IS NOT NULL AND ContractTypeOID > 0)) 
	BEGIN
		DECLARE @ContractTypeOID INT
		SET @ContractTypeOID = (SELECT ContractTypeOID FROM sc_Basket where BasketOID = @BasketOID)
		DECLARE @ContractDiscountType VARCHAR(1)
		SET @ContractDiscountType = (SELECT pct_DiscountType FROM dbo.PDB_ContractType WHERE pct_oid = @ContractTypeOID)
		
		--set the values to 0
		set @gsaDiscount = 0.00
		set @merchdisc = 0.00
		
		--get what the discount should be for any GSA items
			set @gsaDiscountPercent =
		(select Discount/100 
		from OS_Discount 
		where MinMerch <= (@merchtotal-@discnotallowed)
		and MaxMerch >= (@merchtotal-@discnotallowed) and DiscountType = @ContractDiscountType AND GSADiscount = 1)
	
		--get what the discount should be for any other items
		set @merchdiscpercent =
		(select Discount/100 
		from OS_Discount 
		where MinMerch <= (@merchtotal-@discnotallowed)
		and MaxMerch >= (@merchtotal-@discnotallowed) and DiscountType = @ContractDiscountType AND GSADiscount = 0)
		
		DECLARE @GSATotal DECIMAL(10,2)
		DECLARE @OpenMarketTotal DECIMAL(10,2)
		
		SET @GSATotal = 0.00
		SET @OpenMarketTotal = 0.00
		
		SET @GSATotal = (SELECT COALESCE(SUM(QuantityTotal),0) FROM sc_BasketItem inner join Productdw on ItemOID = pdw_ProductOID
					where BasketOID = @BasketOID AND pdw_IsGSA = 1)
					
		SET @OpenMarketTotal = 	@merchtotal - @GSATotal
		
		set @gsaDiscount = @GSATotal * @gsaDiscountPercent
		set @merchdisc = (@OpenMarketTotal-@discnotallowed) * @merchdiscpercent	
		
		update sc_Basket set MerchTotal = @merchtotal, MerchDiscount = @gsaDiscount + @merchdisc,
			GsaDiscount = 0.00, GSADiscountPercent = 0.00, ItemCount = @itemcount
		where BasketOID = @BasketOID	
		
	end
	else
		BEGIN
		--will likely need to add another if clause for selling agreements in the future
			IF (@allowdiscount = 1)
			BEGIN
				set @merchdisc = (@merchtotal-@discnotallowed) * @merchdiscpercent
				update sc_Basket set MerchTotal = @merchtotal, MerchDiscount = @merchdisc,
					GsaDiscount = 0.00, ItemCount = @itemcount
				where BasketOID = @BasketOID
			END
		  ELSE
		  BEGIN  --no discount allowed
  			set @merchdisc = 0.00
				update sc_Basket set MerchTotal = @merchtotal, MerchDiscount = @merchdisc,
					GsaDiscount = 0.00, ItemCount = @itemcount
				where BasketOID = @BasketOID
			END
		END      
	END
