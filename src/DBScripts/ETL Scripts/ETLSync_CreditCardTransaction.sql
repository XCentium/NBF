IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLSync_CreditCardTransaction') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLSync_CreditCardTransaction
GO


create procedure [dbo].[ETLSync_CreditCardTransaction] 
	@Id uniqueidentifier,
	@CustomerOrderId uniqueidentifier,
	@TransactionType nvarchar(50),
	@TransactionDate datetimeoffset(7),
	@Result nvarchar(50),
	@AuthCode nvarchar(200),
	@PNRef nvarchar(100),
	@RespMsg nvarchar(1024),
	@RespText nvarchar(1024),
	@AVSAddr nvarchar(250),
	@AVSZip nvarchar(50),
	@CVV2Match nvarchar(50),
	@RequestId nvarchar(50),
	@RequestString nvarchar(max),
	@ResponseString nvarchar(max),
	@Amount decimal(18,5),
	@Status nvarchar(50),
	@CreditCardNumber nvarchar(50),
	@Name nvarchar(50),
	@ExpirationDate nvarchar(50),
	@OrderNumber nvarchar(50),
	@ShipmentNumber nvarchar(50),
	@CustomerNumber nvarchar(50),
	@Site nvarchar(50),
	@OrigId nvarchar(100),
	@BankCode nvarchar(50),
	@Token1 nvarchar(200),
	@Token2 nvarchar(200),
	@CardType nvarchar(200),
	@PostedToERP bit,
	@InvoiceNumber nvarchar(50)
as
begin

		insert into CreditCardTransaction 
		(
		Id,
		CustomerOrderId,
		TransactionType,
		TransactionDate,
		Result,
		AuthCode,
		PNRef,
		RespMsg,
		RespText,
		AVSAddr,
		AVSZip,
		CVV2Match,
		RequestId,
		RequestString,
		ResponseString,
		Amount,
		[Status],
		CreditCardNumber,
		[Name],
		ExpirationDate,
		OrderNumber,
		ShipmentNumber,
		CustomerNumber,
		[Site],
		OrigId,
		BankCode,
		Token1,
		Token2,
		CardType,
		PostedToERP,
		InvoiceNumber
		)
		values
		(
		@Id,
		@CustomerOrderId,
		@TransactionType,
		@TransactionDate,
		@Result,
		@AuthCode,
		@PNRef,
		@RespMsg,
		@RespText,
		@AVSAddr,
		@AVSZip,
		@CVV2Match,
		@RequestId,
		@RequestString,
		@ResponseString,
		@Amount,
		@Status,
		@CreditCardNumber,
		@Name,
		@ExpirationDate,
		@OrderNumber,
		@ShipmentNumber,
		@CustomerNumber,
		@Site,
		@OrigId,
		@BankCode,
		@Token1,
		@Token2,
		@CardType,
		@PostedToERP,
		@InvoiceNumber
		)

end

GO


