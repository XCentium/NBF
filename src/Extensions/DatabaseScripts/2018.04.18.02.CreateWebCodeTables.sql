/****** Object:  Table [Extensions].[AffiliateCode]    Script Date: 4/18/2018 10:01:47 AM ******/
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Extensions')
BEGIN
    EXEC('CREATE SCHEMA Extensions') -- must be run in it's own batch, this schema will exist and you don't need this here when the custom tables feature is officially released
END

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Extensions].[AffiliateCode](
	[Id] [uniqueidentifier] NOT NULL,
	[AffiliateID] [int] NOT NULL,
	[AffiliateCode] [nvarchar](100) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[ModifiedBy] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_AffiliateCode] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Index [IX_AffiliateCode_NaturalKey]    Script Date: 4/18/2018 10:01:47 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_AffiliateCode_NaturalKey] ON [Extensions].[AffiliateCode]
(
	[AffiliateID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

ALTER TABLE [Extensions].[AffiliateCode] ADD  CONSTRAINT [DF_AffiliateCode_Id]  DEFAULT (newsequentialid()) FOR [Id]
GO

ALTER TABLE [Extensions].[AffiliateCode] ADD  CONSTRAINT [DF_AffiliateCode_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO

ALTER TABLE [Extensions].[AffiliateCode] ADD  CONSTRAINT [DF_AffiliateCode_CreatedBy]  DEFAULT ('') FOR [CreatedBy]
GO

ALTER TABLE [Extensions].[AffiliateCode] ADD  CONSTRAINT [DF_AffiliateCode_ModifiedOn]  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO

ALTER TABLE [Extensions].[AffiliateCode] ADD  CONSTRAINT [DF_AffiliateCode_ModifiedBy]  DEFAULT ('') FOR [ModifiedBy]
GO