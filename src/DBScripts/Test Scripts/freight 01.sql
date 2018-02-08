select top 1000  DeliveryAmount,BasicInsideDelivery,DeluxeInsideDelivery, * from products 
where brandid = 1 and number = '10909'

select top 1000 ShippingWeight, ERPNumber, * from [Insite.NBF].dbo.Product where IsDiscontinued = 0

select ShippingWeight, shi * from [Insite.NBF].dbo.Product where ERPNumber = '10909'

select RequireTruck, * from items where ItemId = 21739

select ShipTypeId, * from ItemSKUs where ItemId = 20740