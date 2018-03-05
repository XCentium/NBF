
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLPriceMatrix_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLPriceMatrix_ToInsite
GO

create procedure ETLPriceMatrix_ToInsite  

as
begin

	-- replace the entire price matrix

	truncate table [Insite.NBF].dbo.PriceMatrix

	insert into [Insite.NBF].dbo.PriceMatrix 
	(
		Id, [RecordType], [CurrencyCode], [Warehouse], [UnitOfMeasure], [CustomerKeyPart], [ProductKeyPart], [ActivateOn], [DeactivateOn], [CalculationFlags],
		[PriceBasis01], [PriceBasis02], [PriceBasis03], [PriceBasis04], [PriceBasis05], [PriceBasis06], [PriceBasis07], [PriceBasis08], [PriceBasis09], [PriceBasis10], [PriceBasis11],
		[AdjustmentType01], [AdjustmentType02], [AdjustmentType03], [AdjustmentType04], [AdjustmentType05], [AdjustmentType06], [AdjustmentType07], [AdjustmentType08], [AdjustmentType09], [AdjustmentType10], [AdjustmentType11],
		[BreakQty01], [BreakQty02], [BreakQty03], [BreakQty04], [BreakQty05], [BreakQty06], [BreakQty07], [BreakQty08], [BreakQty09], [BreakQty10], [BreakQty11],
		[Amount01], [Amount02], [Amount03], [Amount04], [Amount05], [Amount06], [Amount07], [Amount08], [Amount09], [Amount10], [Amount11],
		[AltAmount01], [AltAmount02], [AltAmount03], [AltAmount04], [AltAmount05], [AltAmount06], [AltAmount07], [AltAmount08], [AltAmount09], [AltAmount10], [AltAmount11],
		CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	)
	select 
		Id, [RecordType], [CurrencyCode], [Warehouse], [UnitOfMeasure], [CustomerKeyPart], [ProductKeyPart], [ActivateOn], [DeactivateOn], [CalculationFlags],
		[PriceBasis01], [PriceBasis02], [PriceBasis03], [PriceBasis04], [PriceBasis05], [PriceBasis06], [PriceBasis07], [PriceBasis08], [PriceBasis09], [PriceBasis10], [PriceBasis11],
		[AdjustmentType01], [AdjustmentType02], [AdjustmentType03], [AdjustmentType04], [AdjustmentType05], [AdjustmentType06], [AdjustmentType07], [AdjustmentType08], [AdjustmentType09], [AdjustmentType10], [AdjustmentType11],
		[BreakQty01], [BreakQty02], [BreakQty03], [BreakQty04], [BreakQty05], [BreakQty06], [BreakQty07], [BreakQty08], [BreakQty09], [BreakQty10], [BreakQty11],
		[Amount01], [Amount02], [Amount03], [Amount04], [Amount05], [Amount06], [Amount07], [Amount08], [Amount09], [Amount10], [Amount11],
		[AltAmount01], [AltAmount02], [AltAmount03], [AltAmount04], [AltAmount05], [AltAmount06], [AltAmount07], [AltAmount08], [AltAmount09], [AltAmount10], [AltAmount11],
		CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from PriceMatrix etl

/*

exec ETLPriceMatrix_ToInsite

*/

end
