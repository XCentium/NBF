
IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'dbo.ETLProductDocument_FromOEG') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE dbo.ETLProductDocument_FromOEG
GO

create procedure ETLProductDocument_FromOEG 
as
begin

	declare @IsReady bit
	exec dbo.IsDataReady  'OEGSystem Snapshot', @IsReady output
	if @IsReady = 0	return;

	declare @brand int
	set @brand = 1
	
	truncate table Document 

	declare @LanguageId uniqueidentifier
	select top 1 @LanguageId = l.Id from [Language] l where LanguageCode = 'en-us'


	-- documents

	insert into Document
	(
		[Name],
		[Description],
		[FilePath],
		[DocumentType],
		[LanguageId],
		[ParentId],
		[ParentTable],
		CreatedBy, ModifiedBy
	)
	select 
		spd.WebDescription+'-'+convert(nvarchar(max), spd.DocumentId), 
		spd.WebDescription, 
		spd.[Name], 
		case when spd.[Name] like '%pdf%' then 'pdf' else 'blog' end, 
		@LanguageId, 
		p.Id, 
		'product',
		'etl', 'etl'
	from
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductDocuments spd on spd.ProductId = sp.ProductId
		join Product p on p.ERPNumber = sp.Number
	where 
		sp.BrandId = @brand
	
	-- videos

	insert into Document
	(
		[Name],
		[Description],
		[FilePath],
		[DocumentType],
		[LanguageId],
		[ParentId],
		[ParentTable],
		CreatedBy, ModifiedBy
	)
	select 
		spv.[URL]+'-'+convert(nvarchar(max),spv.Id), 
		isnull(spv.[Description],''), 
		spv.[URL], 'video', 
		@LanguageId, 
		p.Id, 
		'product',
		'etl', 'etl'
	from
		OEGSystemStaging.dbo.Products sp
		join OEGSystemStaging.dbo.ProductVideos spv on spv.ProductId = sp.ProductId
			and spv.TypeId = 1
		join Product p on p.ERPNumber = sp.Number
	where 
		sp.BrandId = @brand





/*
exec ETLProductDocument_FromOEG
exec ETLProductDocument_ToInsite
select * from Document where documenttype = 'blog'
select erpnumber, * from product where id = '0DD846BA-87FD-E711-A98C-A3E0F1200094'
select * from OEGSystemStaging.dbo.ProductDocuments spd
select * from OEGSystemStaging.dbo.ProductVideos where TypeId != 2

*/

end


