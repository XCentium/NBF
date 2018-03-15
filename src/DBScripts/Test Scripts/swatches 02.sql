select ERPNumber, ProductCode, ModelNumber, p.name, ManufacturerItem, PackDescription, ERPDescription
from Product p
where ERPNumber like '%:%' and ProductCode = '10219'
order by ProductCode, ModelNumber, p.name

select erpnumber, * from Product where ERPNumber like '10219%_'

select * from StyleTraitValue where Description = '266042'
select * from StyleTraitValueProduct where StyleTraitValueId = 'A8CB905A-2721-E811-A990-8D1178A76BC2'
