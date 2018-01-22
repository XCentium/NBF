
--update Product set ModifiedOn=getdate() where ModifiedOn is null
--update Product set CreatedOn=getdate() where CreatedOn is null

select * from product where CreatedOn is null
--update StyleClass set ModifiedOn=getdate() where CreatedBy = 'etl' and ModifiedOn is null
--update StyleClass set CreatedOn=getdate() where CreatedBy = 'etl' and CreatedOn is null


--update StyleTrait set ModifiedOn=getdate() where CreatedBy = 'etl' and ModifiedOn is null
--update StyleTrait set CreatedOn=getdate() where CreatedBy = 'etl' and CreatedOn is null

--update StyleTraitValue set ModifiedOn=getdate() where CreatedBy = 'etl' and ModifiedOn is null
--update StyleTraitValue set CreatedOn=getdate() where CreatedBy = 'etl' and CreatedOn is null

select * from Product where ERPNumber = '100048-79724'

select * from StyleClass where name = '178133'
select IsDiscontinued,* from Product where StyleClassId = 'E7A9BCE5-8AF6-E711-A98B-FDA46D6E0349'
select * from product where ERPNumber = '178133-2747498'

select * from  StyleTraitValueProduct
--delete from StyleClass

select dateadd(day, -1, SYSDATETIMEOFFSET())