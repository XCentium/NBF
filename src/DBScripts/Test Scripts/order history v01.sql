select * from HistoryCustomer where cst_Number = 'AZ5778'
select * from HistoryOrder where ord_Number = 'ZJ995178'

select * from [Insite.nbf].dbo.OrderHistory
select * from [Insite.nbf].dbo.OrderHistoryLine
select * from InsiteETL.dbo.OrderHistory where CustomerNumber = '304'
select distinct erpordernumber from InsiteETL.dbo.vwOrderHistory
--delete from InsiteETL.dbo.OrderHistory

--update InsiteETL.dbo.OrderHistory set CustomerNumber = '304' where CustomerNumber = 'AZ5778'
--update InsiteETL.dbo.OrderHistory set CustomerNumber = 'AZ5778' where CustomerNumber = '304'
696550	695641