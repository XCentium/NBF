IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLSync_OrderLine') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLSync_OrderLine
GO


create procedure [dbo].[ETLSync_OrderLine] 
	@Id uniqueidentifier,
	@CustomerOrderId uniqueidentifier,
	@ProductERPNumber nvarchar(50),
	@Status nvarchar(50),
	@Line int,
	@Release int,
	@Description nvarchar(2048),
	@Notes nvarchar(max),
	@QtyOrdered decimal(18,5),
	@UnitRegularPrice decimal(18,5),
	@UnitNetPrice decimal(18,5),
	@UnitOfMeasure nvarchar(50),
	@QtyShipped decimal(18,5),
	@DueDate datetimeoffset(7),
	@PromiseDate datetimeoffset(7),
	@ShipSite nvarchar(50),
	@ShipDate datetimeoffset(7),
	@IsPromotionItem bit,
	@CustomerPOLine nvarchar(50),
	@CostCode nvarchar(100),
	@OrderLineOtherCharges decimal(18,5),
	@TaxAmount decimal(18,5),
	@TotalRegularPrice decimal(18,5),
	@UnitListPrice decimal(18,5),
	@UnitCost decimal(18,5),
	@SmartPart nvarchar(256),
	@TotalNetPrice decimal(18,5)

as
begin

	declare @WebSiteId uniqueidentifier
	select top 1 @WebSiteId = Id from WebSite where Name like '%National Business Furniture%'
	if @WebSiteId is null
	begin
		select '@WebSiteId is null'
	end
	else
	begin

		declare @ProductId uniqueidentifier
		select @ProductId = Id from product where ERPNumber = @ProductERPNumber

		insert into OrderLine 
		(
		Id,
		CustomerOrderId,
		ProductId,
		WebSiteId,
		[Status],
		Line,
		Release,
		[Description],
		Notes,
		QtyOrdered,
		UnitRegularPrice,
		UnitNetPrice,
		UnitOfMeasure,
		QtyShipped,
		DueDate,
		PromiseDate,
		ShipSite,
		ShipDate,
		IsPromotionItem,
		CustomerPOLine,
		CostCode,
		OrderLineOtherCharges,
		TaxAmount,
		TotalRegularPrice,
		UnitListPrice,
		UnitCost,
		SmartPart,
		TotalNetPrice
		)
		values
		(
		@Id,
		@CustomerOrderId,
		@ProductId,
		@WebSiteId,
		@Status,
		@Line,
		@Release,
		@Description,
		@Notes,
		@QtyOrdered,
		@UnitRegularPrice,
		@UnitNetPrice,
		@UnitOfMeasure,
		@QtyShipped,
		@DueDate,
		@PromiseDate,
		@ShipSite,
		@ShipDate,
		@IsPromotionItem,
		@CustomerPOLine,
		@CostCode,
		@OrderLineOtherCharges,
		@TaxAmount,
		@TotalRegularPrice,
		@UnitListPrice,
		@UnitCost,
		@SmartPart,
		@TotalNetPrice
		)
	end

/*

*/

end


GO


