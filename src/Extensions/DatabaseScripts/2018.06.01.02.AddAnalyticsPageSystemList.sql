INSERT INTO SystemList (Name, Description) VALUES ('Analytics Page Data', 'Used to determine analytics values for pages')

DECLARE @ListID AS uniqueidentifier = (SELECT TOP(1) Id FROM SystemList WHERE Name = 'Analytics Page Data')

INSERT INTO SystemListValue (Name, Description, SystemListId) VALUES
('<EXAMPLE>', '<PageName>,<Section>,<SubSection>,<PageType>', @ListID),
('/', 'HomePage,HomePage,HomePage,HomePage', @ListID),
('/Marketing/Workplace', 'Marketing: Workplace,Marketing,Workplace,', @ListID),
('/Marketing/Healthcare', 'Marketing: Healthcare,Marketing,Healthcare,', @ListID),
('/Marketing/Government', 'Marketing: Government,Marketing,Government,', @ListID),
('/Marketing/Education', 'Marketing: Education,Marketing,Education,', @ListID),
('/OrderStatus', 'Customer Service: Track Your Order,Customer Services,Track Your Order,', @ListID)