IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.IsDataReady') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.IsDataReady
GO

create procedure dbo.IsDataReady 
(
	@FunctionalTransaction varchar(50),
	@IsReady bit output
)
as
begin

	set @IsReady = 0

	declare @EndDateTime datetime
	
	select top 1 @EndDateTime=EndDateTime
	from OEGSystemStaging.dbo.DataPushLog 
	where FunctionalTransaction = @FunctionalTransaction 
	order by Id desc

	if @EndDateTime is not null
		set @IsReady = 1

end
go
