IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Extensions')
BEGIN
    EXEC('CREATE SCHEMA Extensions') -- must be run in it's own batch, this schema will exist and you don't need this here when the custom tables feature is officially released
END

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[ShippingChargesRule](
	[Id] [uniqueidentifier] NOT NULL,
	[Type] [nvarchar](1) NOT NULL,
	[MinWeight] [int] NOT NULL,
	[MaxWeight] [int] NOT NULL,
	[DeliveryCharge] [int] NULL,
	[PoundCharge] [int] NULL,
	[PricePerPound] [int] NULL,
	[Markup] [decimal](3,2) NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_ShippingChargesRule] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_ShippingChargesRule_NaturalKey] ON [Extensions].[ShippingChargesRule]
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[ShippingChargesRule] ADD  CONSTRAINT [DF_ShippingChargesRule_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[ShippingChargesRule] ADD  CONSTRAINT [DF_ShippingChargesRule_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[ShippingChargesRule] ADD  CONSTRAINT [DF_ShippingChargesRule_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[ShippingChargesRule] ADD  CONSTRAINT [DF_ShippingChargesRule_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[ShippingChargesRule] ADD  CONSTRAINT [DF_ShippingChargesRule_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

INSERT INTO [Extensions].[ShippingChargesRule] (Type, MinWeight, MaxWeight, DeliveryCharge, PoundCharge, PricePerPound, Markup)
VALUES ('F', 1, 300, 49, NULL, NULL, NULL),
('F', 301, 700, 79, NULL, NULL, NULL),
('F', 701, 900, 199, NULL, NULL, NULL),
('I', 1, 499, 139, NULL, NULL, 0.16),
('I', 500, 699, 155, NULL, NULL, 0.16),
('I', 700, 899, 180, NULL, NULL, 0.16),
('I', 900, 1099, 205, NULL, NULL, 0.16),
('I', 1100, 1299, 255, NULL, NULL, 0.16),
('I', 1300, 1499, 280, NULL, NULL, 0.16),
('I', 1500, 1699, 330, NULL, NULL, 0.16),
('I', 1700, 1899, 355, NULL, NULL, 0.16),
('I', 1900, 2099, 380, NULL, NULL, 0.16),
('I', 2100, 2499, NULL, 100, 15, 0.16),
('I', 2500, 999999, NULL, 100, 14, 0.16)