IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLCategoryProduct_ToInsite') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLCategoryProduct_ToInsite
GO

create procedure ETLCategoryProduct_ToInsite 
as
begin

	insert into [Insite.NBF].dbo.CategoryProduct
	(Id, CategoryId, ProductId, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy)
	select Id, CategoryId, ProductId, CreatedBy, CreatedOn, ModifiedOn, ModifiedBy
	from CategoryProduct etl
	where etl.Id not in (select Id from [Insite.NBF].dbo.CategoryProduct)

/*
exec ETLCategoryProduct_ToInsite
*/
end
	