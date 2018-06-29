DELETE FROM Extensions.StaticCategory

--Create Products Dropdown

INSERT INTO Extensions.StaticCategory (Name, UrlSegment, [Order])
VALUES 
('Desks', '/desks', 0),
('Chairs', '/chairs', 1),
('Tables', '/tables', 2),
('Filing', '/files', 3),
('Storage', '/storage', 4),
('Cubicles', '/partitions', 5),
('Accessories', '/accessories', 6),
('AV Equipment', '/av-equipment', 7),
('Boards', '/boards', 8),
('Decor', '/decor', 9)



DECLARE @desks uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Desks')
DECLARE @chairs uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Chairs')
DECLARE @tables uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Tables')
DECLARE @filing uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Filing')
DECLARE @storage uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Storage')
DECLARE @cubicles uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Cubicles')
DECLARE @accessories uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Accessories')
DECLARE @av uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'AV Equipment')
DECLARE @boards uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Boards')
DECLARE @decor uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Decor')

INSERT INTO Extensions.StaticCategory (Name, UrlSegment, [Order], ParentId) 
Values 
--Desks
('Adjustable Height', '/desks/desks-adjustable-height', 0, @desks),
('Bow Front', '/desks/desks-bow-front-desk', 1, @desks),
('Compact & Small', '/desks/desks-compact-desk', 2, @desks),
('Computer', '/desks/desks-computer-desks', 3, @desks),
('Executive', '/desks/desks-executive-desks', 4, @desks),
('Laminate', '/desks/desks-laminate', 5, @desks),
('L-Shaped', '/desks/desks-l-shaped', 6, @desks),
('Standing Height', '/desks/desks-standing-height', 7, @desks),
('Suites & Sets', '/desks/desks-office-suites', 8, @desks),
('U-Shaped', '/desks/desks-u-shaped', 9, @desks),
('Veneer', '/desks/desks-veneer', 10, @desks),
('Modern', '/desks/desks-modern', 11, @desks),
('Traditional', '/desks/desks-traditional', 12, @desks),
('Ships Today', '?attr=shipstoday', 13, @desks),
('GSA', '?attr=gsa', 14, @desks),
('On Sale', '?attr=onsale', 15, @desks),
('Top Rated', '?attr=toprated', 16, @desks),
('All', '', 17, @desks),
--Chairs
('Big & Tall', '/chairs/chairs-big-and-tall', 0, @chairs),
('Ergonomic', '/chairs/chairs-ergonomic', 1, @chairs),
('Executive', '/chairs/chairs-executive', 2, @chairs),
('Leather', '/chairs/chairs-leather', 3, @chairs),
('Mesh', '/chairs/chairs-mesh', 4, @chairs),
('Reception and Guest', '/chairs/chairs-reception-and-guest-chairs', 5, @chairs),
('Stacking', '/chairs/chairs-stacking', 6, @chairs),
('Modern', '/chairs/chairs-modern', 7, @chairs),
('Traditional', '/chairs/chairs-traditional', 8, @chairs),
('Ships Today', '/chairs?attr=shipstoday', 9, @chairs),
('GSA', '/chairs?attr=gsa', 10, @chairs),
('On Sale', '/chairs?attr=onsale', 11, @chairs),
('Top Rated', '/chairs?attr=toprated', 12, @chairs),
('All', '', 13, @chairs),
--Tables
('ADA Height', '/tables/tables-ada-height-table', 0, @tables),
('Adjustable Height', '/tables/tables-adjustable-height-tables', 1, @tables),
('Conference', '/tables/tables-conference', 2, @tables),
('Flip Top', '/tables/tables-flip-top-table', 3, @tables),
('Folding', '/tables/tables-folding', 4, @tables),
('Standing Height', '/tables/tables-standing-height', 5, @tables),
('Table & Chair Sets', '/tables/tables-table-and-chair-sets', 6, @tables),
('Training', '/tables/tables-training', 7, @tables),
('Utility', '/tables/tables-utility', 8, @tables),
('Ships Today', '/tables?attr=shipstoday', 9, @tables),
('GSA', '/tables?attr=gsa', 10, @tables),
('On Sale', '/tables?attr=onsale', 11, @tables),
('Top Rated', '/tables?attr=toprated', 12, @tables),
('All', '', 13, @tables),
--Filing
('Fireproof', '/files/files-fireproof', 0, @filing),
('Lateral', '/files/files-lateral-files', 1, @filing),
('Metal', '/files/files-metal', 2, @filing),
('Mobile', '/files/files-mobile', 3, @filing),
('Veneer', '/files/files-veneer', 4, @filing),
('Vertical', '/files/files-vertical-files', 5, @filing),
('Ships Today', '/files?attr=shipstoday', 6, @filing),
('GSA', '/files?attr=gsa', 7, @filing),
('On Sale', '/files?attr=onsale', 8, @filing),
('Top Rated', '/files?attr=toprated', 9, @filing),
('All', '', 10, @filing),
--Storage
('Bookcases', '', 0, @storage),
('Cabinets', '/storage/storage-storage-cabinets', 1, @storage),
('Cradenzas', '', 2, @storage),
('Display Cases', '/storage/storage-display-cases', 3, @storage),
('Lockers', '/storage/storage-lockers', 4, @storage),
('Machine Stands', '/storage/storage-machine-stands', 5, @storage),
('Shelving', '/storage/storage-shelving', 6, @storage),
('Storage Islands', '/storage/storage-storage-island', 7, @storage),
('Wardrobes', '/storage/storage-wardrobe-cabinets', 8, @storage),
('Ships Today', '/storage?attr=shipstoday', 9, @storage),
('GSA', '/storage?attr=gsa', 10, @storage),
('On Sale', '/storage?attr=onsale', 11, @storage),
('Top Rated', '/storage?attr=toprated', 12, @storage),
('All', '', 13, @storage),
--Cubicles
('Panel Systems', '/partitions/partitions-panels', 0, @cubicles),
('Office Cubicles', '/partitions/partitions-cubicle', 1, @cubicles),
('Benching', '', 2, @cubicles),
('Call Center Desking', '/partitions/partitions-call-center-desking', 3, @cubicles),
('Team Desking', '/partitions/partitions-team-desking', 4, @cubicles),
('Room Dividers', '/partitions/partitions-room-divider', 5, @cubicles),
('Ships Today', '/partitions?attr=shipstoday', 6, @cubicles),
('GSA', '/partitions?attr=gsa', 7, @cubicles),
('On Sale', '/partitions?attr=onsale', 8, @cubicles),
('Top Rated', '/partitions?attr=toprated', 9, @cubicles),
('All', '', 10, @cubicles),
--Accessories
('Waste Bins', '/accessories/accessories-waste-receptacles', 0, @accessories),
('Chair Mats', '/accessories/accessories-chair-mats', 1, @accessories),
('Computer Accessories', '/accessories/accessories-computer-accessories', 2, @accessories),
('Keyboard Trays', '/accessories/accessories-keyboard-trays', 3, @accessories),
('Paper & Document Shredders', '/accessories/accessories-paper-shredders', 4, @accessories),
('Adjustable Desk Risers', '/accessories/accessories-adjustable-desk-riser', 5, @accessories),
('Floor Mats', '/accessories/accessories-floor-mats', 6, @accessories),
('Coat Racks', '/accessories/accessories-coat-racks', 7, @accessories),
('Signs', '/accessories/accessories-signs', 8, @accessories),
('All', '', 9, @accessories),
--AV Equipment
('Monitor Carts', '/av-equipment/av-equipment-monitor-carts', 0, @av),
('AV Carts', '/av-equipment/av-equipment-av-cart', 1, @av),
('Sound & Audio Equipment', '/av-equipment/av-equipment-sound-equipment', 2, @av),
('Lecterns & Podiums', '/av-equipment/av-equipment-lecterns', 3, @av),
('Boards', '/av-equipment/av-equipment-boards', 4, @av),
('Laptop Storage', '/av-equipment/av-equipment-laptop-storage', 5, @av),
('TV Stands & Media', '/av-equipment/av-equipment-tv-stands', 6, @av),
('Projection Equipment', '/av-equipment/av-equipment-projection-equipment', 7, @av),
('Stages & Platforms', '/av-equipment/av-equipment-stages-and-platforms', 8, @av),
--Boards
('Whiteboards', '/boards/boards-whiteboards', 0, @boards),
('Glass Marker Boards', '/boards/boards-glass', 1, @boards),
('Corkboards', '/boards/boards-corkboards', 2, @boards),
('Bulletin Boards', '/boards/boards-bulletin-boards', 3, @boards),
('Reversible Boards', '/boards/boards-reversible-surface', 4, @boards),
('Directory Boards', '/boards/boards-directory-boards', 5, @boards),
('Enclosed Boards', '/boards/boards-enclosed-boards', 6, @boards),
--Decor
('Office Wall Art', '/decor/decor-wall', 0, @decor),
('Artifical Plants', '/decor/decor-artificial-plants', 1, @decor),
('Wall & Desk Clocks', '/decor/decor-clocks', 2, @decor),
('Desktop Accessories', '/decor/decor-desktop-accessories', 3, @decor),
('Area Rugs', '/decor/decor-area-rug', 4, @decor),
('Decorative Boards', '', 5, @decor),
('Accent Lighting', '', 6, @decor),
('Decorative Mirrors', '/decor/decor-mirror', 7, @decor)

--Create By Area Dropdown

INSERT INTO Extensions.StaticCategory (Name, UrlSegment, [Order], ByArea)
VALUES
('Reception', '/reception-furniture', 0, 1),
('Conference', '/conference-room-furniture', 1, 1),
('Breakroom Furniture', '/breakroom-furniture', 2, 1),
('Training Room', '/training-room-furniture', 3, 1),
('Outdoor Furniture', '/outdoor-furniture', 4, 1)

DECLARE @reception uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Reception' and ByArea = 1)
DECLARE @conference uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Conference' and ByArea = 1)
DECLARE @breakroom uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Breakroom Furniture' and ByArea = 1)
DECLARE @training uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Training Room' and ByArea = 1)
DECLARE @outdoor uniqueidentifier = (select top 1 Id from Extensions.StaticCategory where Name = 'Outdoor Furniture' and ByArea = 1)

INSERT INTO Extensions.StaticCategory (Name, UrlSegment, [Order], ByArea, ParentId)
VALUES
--Reception Furniture
('Desks', '/reception-furniture/reception-furniture-desks', 0, 1, @reception),
('Chairs', '/reception-furniture/reception-furniture-chairs', 1, 1, @reception),
('Sofas', '/reception-furniture/reception-furniture-sofas', 2, 1, @reception),
('Loveseats', '/reception-furniture/reception-furniture-loveseats', 3, 1, @reception),
('Lounge Tables', '/reception-furniture/reception-furniture-tables', 4, 1, @reception),
('Lighting', '/reception-furniture/reception-furniture-lighting', 5, 1, @reception),
('Magazine Racks', '/reception-furniture/reception-furniture-magazine-racks', 6, 1, @reception),
('Mats', '/reception-furniture/reception-furniture-floor-mats', 7, 1, @reception),
('Ships Today', '/reception-furniture?attr=shipstoday', 8, 1, @reception),
('GSA', '/reception-furniture?attr=gsa', 9, 1, @reception),
('On Sale', '/reception-furniture?attr=onsale', 10, 1, @reception),
('Top Rated', '/reception-furniture?attr=toprated', 11, 1, @reception),
('All', '', 12, 1, @reception),
--Conference Furniture
('Chairs & Seating', '/conference-room-furniture/conference-room-furniture-chairs', 0, 1, @conference),
('Tables', '/conference-room-furniture/conference-room-furniture-tables', 1, 1, @conference),
('Tables & Chair Sets', '/conference-room-furniture/conference-room-furniture-table-and-chair-sets', 2, 1, @conference),
('Media Equipment', '', 3, 1, @conference),
('Storage', '/conference-room-furniture/conference-room-furniture-storage', 4, 1, @conference),
('Whiteboards', '/conference-room-furniture/conference-room-furniture-whiteboards', 5, 1, @conference),
('Ships Today', '/conference-room-furniture?attr=shipstoday', 6, 1, @conference),
('GSA', '/conference-room-furniture?attr=gsa', 7, 1, @conference),
('On Sale', '/conference-room-furniture?attr=onsale', 8, 1, @conference),
('Top Rated', '/conference-room-furniture?attr=toprated', 9, 1, @conference),
('All', '', 10, 1, @conference),
--Breakroom Furniture
('Table & Chair Sets', '/breakroom-furniture/breakroom-furniture-table-and-chair-sets', 0, 1, @breakroom),
('Breakroom Tables', '/breakroom-furniture/breakroom-furniture-tables', 1, 1, @breakroom),
('Breakroom Seating', '/breakroom-furniture/breakroom-furniture-chairs', 2, 1, @breakroom),
('Breakroom Storage', '/breakroom-furniture/breakroom-furniture-storage', 3, 1, @breakroom),
('Waste Receptables', '/breakroom-furniture/breakroom-furniture-waste-receptacles', 4, 1, @breakroom),
('GSA', '/breakroom-furniture?attr=gsa', 5, 1, @breakroom),
('On Sale', '/breakroom-furniture?attr=onsale', 6, 1, @breakroom),
('Top Rated', '/breakroom-furniture?attr=toprated', 7, 1, @breakroom),
('All', '', 8, 1, @breakroom),
--Training Room
('Flip Top Tables', '/training-room-furniture/training-room-furniture-flip-top-table', 0, 1, @training),
('Folding Tables', '/training-room-furniture/training-room-furniture-folding-tables', 1, 1, @training),
('Nesting Chairs', '/training-room-furniture/training-room-furniture-nesting-chairs', 2, 1, @training),
('Stacking Chairs', '/training-room-furniture/training-room-furniture-stacking-chairs', 3, 1, @training),
('Lecterns', '/training-room-furniture/training-room-furniture-lecterns', 4, 1, @training),
('Whiteboards', '/training-room-furniture/training-room-furniture-whiteboards', 5, 1, @training),
('AV Carts', '/training-room-furniture/training-room-furniture-av-cart', 6, 1, @training),
('GSA', '/training-room-furniture?attr=gsa', 7, 1, @training),
('On Sale', '/training-room-furniture?attr=onsale', 8, 1, @training),
('Top Rated', '/training-room-furniture?attr=toprated', 9, 1, @training),
('All', '', 10, 1, @training),
--Outdoor Furniture
('Benches', '/outdoor-furniture/outdoor-furniture-benches', 0, 1, @outdoor),
('Outdoor Tables', '/outdoor-furniture/outdoor-furniture-tables', 1, 1, @outdoor),
('Waste Receptacles', '/outdoor-furniture/outdoor-furniture-waste-receptacles', 2, 1, @outdoor),
('Signs', '/outdoor-furniture/outdoor-furniture-signs', 3, 1, @outdoor),
('All', '', 4, 1, @outdoor)




/**

select s1.Name as Category, s2.Name as SubCategory
from Extensions.StaticCategory s1
join Extensions.StaticCategory s2 on s2.ParentId = s1.Id

**/