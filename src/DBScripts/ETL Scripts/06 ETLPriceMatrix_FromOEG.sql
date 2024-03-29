
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLPriceMatrix_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLPriceMatrix_FromOEG
GO

create procedure ETLPriceMatrix_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	truncate table PriceMatrix 

	-- regular price

	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 1
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 2
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 3
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 4
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 5
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 6
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 7
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 8
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 9
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 10
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, '', 11

	-- gsa

	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 1
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 2
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 3
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 4
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 5
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 6
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 7
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 8
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 9
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 10
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'gsa', 11

	-- sale

	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 1
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 2
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 3
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 4
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 5
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 6
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 7
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 8
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 9
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 10
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'Product Sale', 11

	-- medical

	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 1
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 2
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 3
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 4
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 5
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 6
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 7
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 8
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 9
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 10
	exec ETLPriceMatrix_ByPriceCode_FromOEG 1, 'medical', 11

	-- update products with sale prices on the product table to trigger some out of
	-- the box functionality for Insite
	update Product set
		BasicSalePrice = 0,
		BasicSaleStartDate = null,
		BasicListPrice = 0

/*
exec ETLPriceMatrix_FromOEG
select * from PriceMatrix where breakqty05 != 0



*/

end


