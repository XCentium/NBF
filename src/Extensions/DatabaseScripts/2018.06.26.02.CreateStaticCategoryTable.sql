DROP TABLE [Extensions].[StaticCategory]
GO

/****** Object:  Table [Extensions].[StaticCategory]    Script Date: 6/26/2018 1:44:33 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[StaticCategory](
	[Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_StaticCategory_Id]  DEFAULT (newsequentialid()),
	[ParentId] [uniqueidentifier] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[MetaDescription] [nvarchar](max) NULL,
	[MetaKeyword] [nvarchar](max) NULL,
	[UrlSegment] [nvarchar](255) NULL,
	[Order] [int] NOT NULL,
	[ByArea] [bit] NOT NULL DEFAULT ((0)),
	[CreatedOn] [datetimeoffset](7) NULL CONSTRAINT [DF_StaticCategory_CreatedOn]  DEFAULT (getutcdate()),
	[CreatedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_StaticCategory_CreatedBy]  DEFAULT (''),
	[ModifiedOn] [datetimeoffset](7) NULL CONSTRAINT [DF_StaticCategory_ModifiedOn]  DEFAULT (getutcdate()),
	[ModifiedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_StaticCategory_ModifiedBy]  DEFAULT (''),
 CONSTRAINT [PK_StaticCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = ON, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


