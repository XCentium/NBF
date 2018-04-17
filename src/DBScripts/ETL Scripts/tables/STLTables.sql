/****** Object:  Table [extensions].[STLCategory]    Script Date: 4/17/2018 6:33:37 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [extensions].[STLCategory](
	[Id] [uniqueidentifier] NOT NULL,
	[Status] [varchar](1) NULL,
	[Name] [varchar](50) NULL,
	[Description] [varchar](2000) NULL,
	[MainImage] [varchar](50) NULL,
	[SortOrder] [int] NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_STLCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

/****** Object:  Table [extensions].[STLRoomLook]    Script Date: 4/17/2018 6:33:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [extensions].[STLRoomLook](
	[Id] [uniqueidentifier] NOT NULL,
	[Status] [varchar](1) NULL,
	[Title] [varchar](50) NULL,
	[Description] [varchar](2000) NULL,
	[MainImage] [varchar](50) NULL,
	[SortOrder] [int] NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_STLRoomLook] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

/****** Object:  Table [extensions].[STLRoomLooksCategory]    Script Date: 4/17/2018 6:34:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [extensions].[STLRoomLooksCategory](
	[Id] [uniqueidentifier] NOT NULL,
	[STLRoomLookId] [uniqueidentifier] NOT NULL,
	[STLCategoryId] [uniqueidentifier] NOT NULL,
	[SortOrder] [int] NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_STLRoomLooksCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLook] FOREIGN KEY([STLRoomLookId])
REFERENCES [extensions].[STLRoomLook] ([Id])
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] CHECK CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLook]
GO

ALTER TABLE [extensions].[STLRoomLooksCategory]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLooksCategory] FOREIGN KEY([STLCategoryId])
REFERENCES [extensions].[STLCategory] ([Id])
GO

ALTER TABLE [extensions].[STLRoomLooksCategory] CHECK CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLooksCategory]
GO

/****** Object:  Table [extensions].[STLRoomLooksProduct]    Script Date: 4/17/2018 6:34:25 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [extensions].[STLRoomLooksProduct](
	[Id] [uniqueidentifier] NOT NULL,
	[STLRoomLookId] [uniqueidentifier] NOT NULL,
	[ProductId] [uniqueidentifier] NOT NULL,
	[XPosition] [int] NULL,
	[YPosition] [int] NULL,
	[SortOrder] [int] NULL,
	[AdditionalProduct] [bit] NULL,
	[AdditionalProductSort] [int] NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_STLRoomLooksProduct] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksProduct_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([Id])
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] CHECK CONSTRAINT [FK_STLRoomLooksProduct_Product]
GO

ALTER TABLE [extensions].[STLRoomLooksProduct]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksProduct_STLRoomLook] FOREIGN KEY([STLRoomLookId])
REFERENCES [extensions].[STLRoomLook] ([Id])
GO

ALTER TABLE [extensions].[STLRoomLooksProduct] CHECK CONSTRAINT [FK_STLRoomLooksProduct_STLRoomLook]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'extensions', @level1type=N'TABLE',@level1name=N'STLRoomLooksProduct'
GO

/****** Object:  Table [extensions].[STLRoomLooksStyle]    Script Date: 4/17/2018 6:35:28 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [extensions].[STLRoomLooksStyle](
	[Id] [uniqueidentifier] NOT NULL,
	[STLRoomLookId] [uniqueidentifier] NOT NULL,
	[StyleName] [nvarchar](50) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_STLRoomLooksStyle] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

ALTER TABLE [extensions].[STLRoomLooksStyle]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksStyle_STLRoomLook] FOREIGN KEY([STLRoomLookId])
REFERENCES [extensions].[STLRoomLook] ([Id])
GO

ALTER TABLE [extensions].[STLRoomLooksStyle] CHECK CONSTRAINT [FK_STLRoomLooksStyle_STLRoomLook]
GO



