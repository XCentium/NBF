DROP TABLE [Extensions].[STLRoomLooksStyle]
GO
DROP TABLE [Extensions].[STLRoomLooksProduct]
GO
DROP TABLE [Extensions].[STLRoomLooksCategory]
GO
DROP TABLE [Extensions].[STLRoomLook]
GO
DROP TABLE [Extensions].[STLCategory]
GO


/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2016
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

/****** Object:  Table [Extensions].[STLCategory]    Script Date: 4/19/2018 5:51:18 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[STLCategory](
	[Id] [uniqueidentifier] NOT NULL,
	[Status] [varchar](1) NULL,
	[Name] [varchar](50) NOT NULL,
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

SET ANSI_PADDING ON
GO

/****** Object:  Index [IX_STLCategory_NaturalKey]    Script Date: 4/19/2018 5:51:18 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_STLCategory_NaturalKey] ON [Extensions].[STLCategory]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[STLCategory] ADD  CONSTRAINT [DF_STLCategory_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO


/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2016
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

/****** Object:  Table [Extensions].[STLRoomLook]    Script Date: 4/19/2018 5:52:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[STLRoomLook](
	[Id] [uniqueidentifier] NOT NULL,
	[Status] [varchar](1) NULL,
	[Title] [varchar](50) NOT NULL,
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

SET ANSI_PADDING ON
GO

/****** Object:  Index [IX_STLRoomLook_NaturalKey]    Script Date: 4/19/2018 5:52:01 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_STLRoomLook_NaturalKey] ON [Extensions].[STLRoomLook]
(
	[Title] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[STLRoomLook] ADD  CONSTRAINT [DF_STLRoomLook_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO



/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2016
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

/****** Object:  Table [Extensions].[STLRoomLooksCategory]    Script Date: 4/19/2018 5:53:15 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[STLRoomLooksCategory](
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

/****** Object:  Index [IX_STLRoomLooksCategory_NaturalKey]    Script Date: 4/19/2018 5:53:15 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_STLRoomLooksCategory_NaturalKey] ON [Extensions].[STLRoomLooksCategory]
(
	[STLCategoryId] ASC,
	[STLRoomLookId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] ADD  CONSTRAINT [DF_STLRoomLooksCategory_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLook] FOREIGN KEY([STLRoomLookId])
REFERENCES [Extensions].[STLRoomLook] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] CHECK CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLook]
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLooksCategory] FOREIGN KEY([STLCategoryId])
REFERENCES [Extensions].[STLCategory] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [Extensions].[STLRoomLooksCategory] CHECK CONSTRAINT [FK_STLRoomLooksCategory_STLRoomLooksCategory]
GO


/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2016
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

/****** Object:  Table [Extensions].[STLRoomLooksProduct]    Script Date: 4/19/2018 5:54:27 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[STLRoomLooksProduct](
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

/****** Object:  Index [IX_STLRoomLooksProduct_NaturalKey]    Script Date: 4/19/2018 5:54:27 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_STLRoomLooksProduct_NaturalKey] ON [Extensions].[STLRoomLooksProduct]
(
	[ProductId] ASC,
	[STLRoomLookId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] ADD  CONSTRAINT [DF_STLRoomLooksProduct_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksProduct_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] CHECK CONSTRAINT [FK_STLRoomLooksProduct_Product]
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksProduct_STLRoomLook] FOREIGN KEY([STLRoomLookId])
REFERENCES [Extensions].[STLRoomLook] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [Extensions].[STLRoomLooksProduct] CHECK CONSTRAINT [FK_STLRoomLooksProduct_STLRoomLook]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'Extensions', @level1type=N'TABLE',@level1name=N'STLRoomLooksProduct'
GO


/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2016
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

/****** Object:  Table [Extensions].[STLRoomLooksStyle]    Script Date: 4/19/2018 5:54:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[STLRoomLooksStyle](
	[Id] [uniqueidentifier] NOT NULL,
	[STLRoomLookId] [uniqueidentifier] NOT NULL,
	[StyleName] [nvarchar](50) NOT NULL,
	[SortOrder] [int] NULL,
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

SET ANSI_PADDING ON
GO

/****** Object:  Index [IX_STLRoomLooksStyle_NaturalKey]    Script Date: 4/19/2018 5:54:46 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_STLRoomLooksStyle_NaturalKey] ON [Extensions].[STLRoomLooksStyle]
(
	[STLRoomLookId] ASC,
	[StyleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle] ADD  CONSTRAINT [DF_STLRoomLooksStyle_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle]  WITH CHECK ADD  CONSTRAINT [FK_STLRoomLooksStyle_STLRoomLook] FOREIGN KEY([STLRoomLookId])
REFERENCES [Extensions].[STLRoomLook] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [Extensions].[STLRoomLooksStyle] CHECK CONSTRAINT [FK_STLRoomLooksStyle_STLRoomLook]
GO

