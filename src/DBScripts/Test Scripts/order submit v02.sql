select * from customerorder where OrderNumber='WEB002088'
select * from CreditCardTransaction  where result=0 where CustomerOrderId = 'C7101AF0-A935-432D-B2F8-A8A3016586B5'

select  customerOrderId,count(*) from CreditCardTransaction 
where result=0
group by customerOrderId
having count(*) > 1

select * from CreditCardTransaction where CustomerOrderId='B01C6EA4-29B0-4053-98A9-A8B201878132'
select * from customerorder where id = 'B01C6EA4-29B0-4053-98A9-A8B201878132'

select * from customerorder where OrderNumber='WEB002123'
select * from customerorder where id = 'DA239208-27CF-4862-8660-A8B600E87EEE'
select * from OrderLine where CustomerOrderId = 'DA239208-27CF-4862-8660-A8B600E87EEE'
select * from CreditCardTransaction where CustomerOrderId = 'DA239208-27CF-4862-8660-A8B600E87EEE'
S D C V

select count(*) from IntegrationJobLog  where IntegrationJobId = '73AAA5EA-35FB-4E23-977D-18486BFEF2CE'

