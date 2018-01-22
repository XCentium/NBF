



delete from Category where CreatedBy = 'etl'
delete from Content where CreatedBy = 'etl'
delete from ContentManager where CreatedBy = 'etl'
delete from CategoryProduct where CreatedBy = 'etl'


delete from StyleTraitValueProduct 
delete from StyleTraitValue where createdby = 'etl'
delete from StyleTrait where createdby = 'etl'
delete from product where createdby = 'etl'
delete from StyleClass where createdby = 'etl'

delete from CustomerProduct
