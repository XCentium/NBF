select productid, count(*) from productimage
group by productid
having count(*) =5

select count(*) from productimage

select * from product where StyleParentId is null

select * from product where id not in (select productid from productimage) and StyleParentId is null