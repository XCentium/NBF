USE [NBF]
GO
/****** Object:  StoredProcedure [dbo].[p_sc_CalculateServiceChargeTotals]    Script Date: 12/20/2017 11:09:13 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*creating stored procs*/

ALTER procedure [dbo].[p_sc_CalculateServiceChargeTotals](
	@BasketOID int
)
as

set nocount on
/*
--for testing
declare @Basket_OID int
set @Basket_OID = 214
*/
--done differently for NBF - add to the basket vendor by another calculation

--see if need to update additional delivery (added an item, removed, etc) 
--check to see if some have it.  If some do, all should
IF (SELECT SUM(ServiceCharge) FROM sc_BasketVendor WHERE basketoid = @BAsketOID) > 0
BEGIN
	CREATE TABLE #tempvendorcalc
(
	Vendorcode VARCHAR(3),
	ShippingMethod CHAR(1),
	totalWeight DECIMAL(10,2),
	AdditionalDeliveryCharge DECIMAL (10,2),
	AdditionalDeliveryType CHAR(1),
	DeluxeFreightTotal DECIMAL(10,2)
	)
	INSERT INTO #tempvendorcalc
	EXEC p_sc_CheckAdditionalDelivery @BasketOID
	
	SELECT * FROM #tempvendorcalc
	
	DECLARE @ServiceChargeType VARCHAR(1)
	SET @ServiceChargeType = (SELECT TOP 1 AdditionalDeliveryType FROM #tempvendorcalc)
	
	UPDATE sc_BasketVendor SET ServiceChargeType = @ServiceChargeType, 
	ServiceCharge = (SELECT ISNULL(AdditionalDeliveryCharge,0) FROM #tempvendorcalc TVC WHERE sc_BasketVendor.Vendorcode = TVC.VendorCode)
	WHERE basketoid = @BasketOID
	
END

--update basket with service charges
update sc_Basket set ServiceChargeTotal = (SELECT ISNULL(SUM(servicecharge),0) FROM dbo.sc_BasketVendor WHERE BasketOID=@BasketOID), ModifiedTime = getdate() where BasketOID = @BasketOID



