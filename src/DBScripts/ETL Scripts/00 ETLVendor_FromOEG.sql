
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLVendor_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLVendor_FromOEG
GO

create procedure ETLVendor_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	insert into Vendor 
	(VendorNumber, [Name], CreatedBy, ModifiedBy)
	select 
		v.Code VendorNumber,
		v.DisplayName [Name],
		'etl','etl'
	from
		OEGSystemStaging.dbo.Vendors v
	where 
		v.Code not in (select VendorNumber from Vendor)
		and isnull(v.Code,'') != ''


	update Vendor set
		[Name] = s.DisplayName,
		CreatedBy = 'etl',
		ModifiedBy = 'etl',
		ModifiedOn = getdate()
	from 
		OEGSystemStaging.dbo.Vendors s
		join Vendor v on v.VendorNumber = s.Code



/*
ETLVendor_FromOEG
*/

end


