/****** Object:  Table [Extensions].[ShippingByVendor]    Script Date: 6/19/2018 2:41:57 PM ******/
DROP TABLE [Extensions].[ShippingByVendor]
GO

/****** Object:  Table [Extensions].[ShippingByVendor]    Script Date: 6/19/2018 2:41:57 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [Extensions].[ShippingByVendor](
	[Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ShippingByVendor_Id]  DEFAULT (newsequentialid()),
	[OrderNumber] [nvarchar](50) NOT NULL,
	[VendorCode] [nvarchar](3) NOT NULL,
	[BaseShippingCost] [decimal](12, 2) NOT NULL,
	[AdditionalShippingCost] [decimal](12, 2) NOT NULL,
	[Tax] [decimal](12, 2) NOT NULL,
	[ShipCode] [varchar](1) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NULL CONSTRAINT [DF_ShippingByVendor_CreatedOn]  DEFAULT (getutcdate()),
	[CreatedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_ShippingByVendor_CreatedBy]  DEFAULT (''),
	[ModifiedOn] [datetimeoffset](7) NULL CONSTRAINT [DF_ShippingByVendor_ModifiedOn]  DEFAULT (getutcdate()),
	[ModifiedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_ShippingByVendor_ModifiedBy]  DEFAULT (''),
 CONSTRAINT [PK_ShippingByVendor] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = ON, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


