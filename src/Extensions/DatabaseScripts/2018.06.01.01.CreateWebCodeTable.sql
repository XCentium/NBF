﻿/****** Object:  Table [Extensions].[WebcodeUniqueID]    Script Date: 6/1/2018 10:06:42 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP TABLE [Extensions].[WebcodeUniqueID]
GO

CREATE TABLE [Extensions].[WebcodeUniqueID](
    [Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_WebcodeUniqueID_Id]  DEFAULT (newsequentialid()),
    [WebcodeUniqueID] [bigint] IDENTITY(1,1) NOT NULL,
    [CreatedOn] [datetimeoffset](7) NULL CONSTRAINT [DF_WebcodeUniqueID_CreatedOn]  DEFAULT (getutcdate()),
    [CreatedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_WebcodeUniqueID_CreatedBy]  DEFAULT (''),
    [ModifiedOn] [datetimeoffset](7) NULL CONSTRAINT [DF_WebcodeUniqueID_ModifiedOn]  DEFAULT (getutcdate()),
    [ModifiedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_WebcodeUniqueID_ModifiedBy]  DEFAULT (''),
CONSTRAINT [PK_WebcodeUniqueID] PRIMARY KEY CLUSTERED 
(
    [Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = ON, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Create Referral Link for Testing  *******/
DELETE FROM [Extensions].[AffiliateCode] 
      WHERE [Extensions].[AffiliateCode].AffiliateCode = 'ochdev'
GO

INSERT INTO [Extensions].[AffiliateCode]
           (
           [AffiliateNumber]
           ,[AffiliateCode]
           )
     VALUES
           ('14439200','ochdev')
GO