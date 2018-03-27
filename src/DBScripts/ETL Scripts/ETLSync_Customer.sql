IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLSync_Customer') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLSync_Customer
GO


create procedure [dbo].[ETLSync_Customer] 
	@Id uniqueidentifier,
	@CustomerNumber nvarchar(50),
	@CustomerSequence nvarchar(50)

as
begin

	if not exists (select Id from Customer where Id = @Id)
	begin
			insert into Customer 
			(
			Id, CustomerNumber, CustomerSequence
			)
			values
			(
			@Id, @CustomerNumber, @CustomerSequence
			)
	end
	else
	begin

		update Customer set
			CustomerNumber = @CustomerNumber,
			CustomerSequence = @CustomerSequence
		where
			Id = @Id

		end

/*

*/

end


GO


