
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductImage_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductImage_ToInsite
GO

create procedure ETLProductImage_ToInsite  

as
begin
	truncate table [Insite.NBF].dbo.ProductImage

	insert into [Insite.NBF].dbo.ProductImage 
	(
	Id, [ProductId], [Name], [SmallImagePath], [MediumImagePath], [LargeImagePath], [AltText], [SortOrder],
	CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	)
	select 
		Id, [ProductId], [Name], [SmallImagePath], [MediumImagePath], [LargeImagePath], [AltText], [SortOrder],
		CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from ProductImage etl

/*

exec ETLProductImage_ToInsite

*/

end
