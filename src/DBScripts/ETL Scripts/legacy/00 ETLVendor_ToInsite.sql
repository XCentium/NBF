IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLVendor_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLVendor_ToInsite
GO

create procedure ETLVendor_ToInsite 
as
begin

	--updates
	update [Insite.NBF].dbo.Vendor set
		VendorNumber = etl.VendorNumber,
		[Name] = etl.[Name],
		CreatedBy = etl.CreatedBy,
		CreatedOn = etl.CreatedOn,
		ModifiedOn = etl.ModifiedOn,
		ModifiedBy = etl.ModifiedBy
	from Vendor etl
	join [Insite.NBF].dbo.Vendor v on v.Id = etl.Id

	--new
	insert into [Insite.NBF].dbo.Vendor
	(Id, VendorNumber, [Name], CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, VendorNumber, [Name], CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from Vendor etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.Vendor)

/*
exec ETLVendor_ToInsite
*/
end