IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Extensions')
BEGIN
    EXEC('CREATE SCHEMA Extensions') -- must be run in it's own batch, this schema will exist and you don't need this here when the custom tables feature is officially released
END

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[ShippingByVendor](
	[Id] [uniqueidentifier] NOT NULL,
	[OrderNumber] [nvarchar](50) NOT NULL,
	[VendorId] [uniqueidentifier] NOT NULL,
	[ShippingCost] decimal(12,2) NOT NULL,
	[Tax] decimal(12,2) NOT NULL,
	[ShipCode] [varchar](1) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_ShippingByVendor] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[ShippingByVendor] ADD  CONSTRAINT [DF_ShippingByVendor_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[ShippingByVendor] ADD  CONSTRAINT [DF_ShippingByVendor_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[ShippingByVendor] ADD  CONSTRAINT [DF_ShippingByVendor_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[ShippingByVendor] ADD  CONSTRAINT [DF_ShippingByVendor_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[ShippingByVendor] ADD  CONSTRAINT [DF_ShippingByVendor_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO