/****** Object:  Table [extensions].[TestTable]    Script Date: 3/26/2018 10:43:15 AM ******/
  SET ANSI_NULLS ON
  GO

  SET QUOTED_IDENTIFIER ON
  GO

  CREATE TABLE [extensions].[TestTable](
  [Id] [uniqueidentifier] NOT NULL,
  [Column1] [nvarchar](50) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_TestTable] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [extensions].[TestTable] ADD  CONSTRAINT [DF_TestTable_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [extensions].[TestTable] ADD  CONSTRAINT [DF_TestTable_Column1]  DEFAULT ('') FOR [Column1]
GO

ALTER TABLE [extensions].[TestTable] ADD  CONSTRAINT [DF_TestTable_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [extensions].[TestTable] ADD  CONSTRAINT [DF_TestTable_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [extensions].[TestTable] ADD  CONSTRAINT [DF_TestTable_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [extensions].[TestTable] ADD  CONSTRAINT [DF_TestTable_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO


