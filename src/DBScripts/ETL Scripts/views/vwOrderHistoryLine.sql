IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.vwOrderHistoryLine') AND type IN ( N'V' ) ) 
	DROP VIEW [dbo].vwOrderHistoryLine
GO


CREATE VIEW [dbo].[vwOrderHistoryLine]
AS


SELECT 
		ohl.Id,
		ohl.OrderHistoryId,
		oh.ERPOrderNumber,
		ohl.CustomerNumber,
		ohl.LineNumber,
		ohl.ProductERPNumber,
		ohl.Description,
		ohl.QtyOrdered,
		ohl.UnitOfMeasure,
		ohl.InventoryQtyOrdered,
		ohl.UnitRegularPrice,
		ohl.UnitListPrice,
		ohl.UnitDiscountAmount,
		ohl.UnitNetPrice,
		ohl.TotalRegularPrice,
		ohl.TotalDiscountAmount,
		ohl.TotalNetPrice,
		ohl.RMAQtyRequested,
		ohl.RMAQtyReceived,
		ohl.CreatedBy,
		ohl.ModifiedBy

FROM
	OrderHistoryLine ohl
	join OrderHistory oh on oh.Id = ohl.OrderHistoryId

/*
select * from vwOrderHistoryLine 
*/

GO