select * from [vwStyleTraitValueProduct] 
where ERPNumber like '44183_%'
order by ERPNumber, StyleTraitName, StyleTraitValue 


with dd as
(
select distinct ERPNumber, StyleTraitName from [vwStyleTraitValueProduct] 
where ERPNumber in (select ERPNumber from Product p where IsDiscontinued = 0 
--and p.Id in (select ProductId from CategoryProduct where ProductId = p.Id )
)
)
select ERPNumber, count(*) from dd
group by ERPNumber
having count(*) = 4

select * from CategoryProduct where ProductId = 'C4AC14C1-87FD-E711-A98C-A3E0F1200094'