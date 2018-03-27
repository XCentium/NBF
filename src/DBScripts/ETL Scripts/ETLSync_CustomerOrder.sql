IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLSync_CustomerOrder') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLSync_CustomerOrder
GO


create procedure [dbo].[ETLSync_CustomerOrder] 
	@Id uniqueidentifier,
	@CustomerId uniqueidentifier,
	@ShipToId uniqueidentifier,
	@Status nvarchar(50),
	@OrderNumber nvarchar(50),
	@OrderDate datetimeoffset(7),
	@CustomerPO nvarchar(50),

	@TermsCode nvarchar(50),
	@ShipCode nvarchar(50),
	@ShippingCharges decimal(18,5),
	@HandlingCharges decimal(18,5),
	@CustomerNumber nvarchar(50),
	@CustomerSequence nvarchar(50),

	@BTCompanyName nvarchar(100),
	@BTFirstName nvarchar(100),
	@BTMiddleName nvarchar(100),
	@BTLastName nvarchar(100),
	@BTPhone nvarchar(50),
	@BTAddress1 nvarchar(100),
	@BTAddress2 nvarchar(100),
	@BTAddress3 nvarchar(100),
	@BTAddress4 nvarchar(100),
	@BTCity nvarchar(100),
	@BTState nvarchar(50),
	@BTPostalCode nvarchar(50),
	@BTCountry nvarchar(100),
	@BTEmail nvarchar(100),

	@STCompanyName nvarchar(100),
	@STFirstName nvarchar(100),
	@STMiddleName nvarchar(100),
	@STLastName nvarchar(100),
	@STPhone nvarchar(50),
	@STAddress1 nvarchar(100),
	@STAddress2 nvarchar(100),
	@STAddress3 nvarchar(100),
	@STAddress4 nvarchar(100),
	@STCity nvarchar(100),
	@STState nvarchar(50),
	@STPostalCode nvarchar(50),
	@STCountry nvarchar(100),
	@STEmail nvarchar(100),

	@ERPOrderNumber nvarchar(50),
	@RequestedShipDate datetimeoffset(7),
	@OtherCharges decimal(18,5),
	@TaxAmount decimal(18,5),
	@OrderTotal decimal(18,5),
	@LastPricingOn datetimeoffset(7)

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

		-- first we delete any previous order with this same Id
		delete from CustomerOrder where Id = @Id

		insert into CustomerOrder 
		(
		Id,
		CustomerId,
		ShipToId,
		WebSiteId,
		[Status],
		OrderNumber,
		OrderDate,
		CustomerPO,

		TermsCode,
		ShipCode,
		ShippingCharges,
		HandlingCharges,
		CustomerNumber,
		CustomerSequence,
		BTCompanyName,
		BTFirstName,
		BTMiddleName,
		BTLastName,
		BTPhone,
		BTAddress1,
		BTAddress2,
		BTAddress3,
		BTAddress4,
		BTCity,
		BTState,
		BTPostalCode,
		BTCountry,
		BTEmail,

		STCompanyName,
		STFirstName,
		STMiddleName,
		STLastName,
		STPhone,
		STAddress1,
		STAddress2,
		STAddress3,
		STAddress4,
		STCity,
		STState,
		STPostalCode,
		STCountry,
		STEmail,

		ERPOrderNumber,
		RequestedShipDate,
		OtherCharges,
		TaxAmount,
		OrderTotal,
		LastPricingOn
		)
		values
		(
		@Id,
		@CustomerId,
		@ShipToId,
		@WebSiteId,
		@Status,
		@OrderNumber,
		@OrderDate,
		@CustomerPO,

		@TermsCode,
		@ShipCode,
		@ShippingCharges,
		@HandlingCharges,
		@CustomerNumber,
		@CustomerSequence,
		@BTCompanyName,
		@BTFirstName,
		@BTMiddleName,
		@BTLastName,
		@BTPhone,
		@BTAddress1,
		@BTAddress2,
		@BTAddress3,
		@BTAddress4,
		@BTCity,
		@BTState,
		@BTPostalCode,
		@BTCountry,
		@BTEmail,

		@STCompanyName,
		@STFirstName,
		@STMiddleName,
		@STLastName,
		@STPhone,
		@STAddress1,
		@STAddress2,
		@STAddress3,
		@STAddress4,
		@STCity,
		@STState,
		@STPostalCode,
		@STCountry,
		@STEmail,

		@ERPOrderNumber,
		@RequestedShipDate,
		@OtherCharges,
		@TaxAmount,
		@OrderTotal,
		@LastPricingOn
		)
	end

/*

*/

end


GO


