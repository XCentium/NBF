IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwPriceMatrix') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].[vwPriceMatrix]
GO


CREATE VIEW [dbo].[vwPriceMatrix]
AS



SELECT 
	pm.Id,
	pm.RecordType,
	pm.CurrencyCode,
	pm.Warehouse,
	pm.UnitOfMeasure,
	pm.CustomerKeyPart,
	pm.ProductKeyPart,
	convert(nvarchar(10), pm.ActivateOn, 101) ActivateOn,
	convert(nvarchar(10), pm.DeactivateOn, 101) DeactivateOn,
	p.ERPNumber ProductERPNumber,
	pm.CalculationFlags,
	pm.PriceBasis01,
	pm.PriceBasis02,
	pm.PriceBasis03,
	pm.PriceBasis04,
	pm.PriceBasis05,
	pm.PriceBasis06,
	pm.PriceBasis07,
	pm.PriceBasis08,
	pm.PriceBasis09,
	pm.PriceBasis10,
	pm.PriceBasis11,
	pm.AdjustmentType01,
	pm.AdjustmentType02,
	pm.AdjustmentType03,
	pm.AdjustmentType04,
	pm.AdjustmentType05,
	pm.AdjustmentType06,
	pm.AdjustmentType07,
	pm.AdjustmentType08,
	pm.AdjustmentType09,
	pm.AdjustmentType10,
	pm.AdjustmentType11,
	pm.BreakQty01,
	pm.BreakQty02,
	pm.BreakQty03,
	pm.BreakQty04,
	pm.BreakQty05,
	pm.BreakQty06,
	pm.BreakQty07,
	pm.BreakQty08,
	pm.BreakQty09,
	pm.BreakQty10,
	pm.BreakQty11,
	pm.Amount01,
	pm.Amount02,
	pm.Amount03,
	pm.Amount04,
	pm.Amount05,
	pm.Amount06,
	pm.Amount07,
	pm.Amount08,
	pm.Amount09,
	pm.Amount10,
	pm.Amount11,
	pm.AltAmount01,
	pm.AltAmount02,
	pm.AltAmount03,
	pm.AltAmount04,
	pm.AltAmount05,
	pm.AltAmount06,
	pm.AltAmount07,
	pm.AltAmount08,
	pm.AltAmount09,
	pm.AltAmount10,
	pm.AltAmount11
from
	PriceMatrix pm
	left join Product p on pm.ProductKeyPart = p.Id

--where
--	pm.ProductKeyPart = '62DE46BA-87FD-E711-A98C-A3E0F1200094'

/*
select * from vwPriceMatrix
*/


GO