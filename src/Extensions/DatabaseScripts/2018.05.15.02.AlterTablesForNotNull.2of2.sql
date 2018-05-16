/*
   Thursday, May 10, 20184:27:20 PM
   User: 
   Server: .\sql2016
   Database: Insite.nbf
   Application: 
*/

/* To prevent any potential data loss issues, you should review this script in detail before running it outside the context of the database designer.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE Extensions.STLCategory
	DROP CONSTRAINT DF_STLCategory_Id
GO
ALTER TABLE Extensions.STLCategory
	DROP CONSTRAINT DF_STLCategory_CreatedOn
GO
ALTER TABLE Extensions.STLCategory
	DROP CONSTRAINT DF_STLCategory_CreatedBy
GO
ALTER TABLE Extensions.STLCategory
	DROP CONSTRAINT DF_STLCategory_ModifiedOn
GO
ALTER TABLE Extensions.STLCategory
	DROP CONSTRAINT DF_STLCategory_ModifiedBy
GO
CREATE TABLE Extensions.Tmp_STLCategory
	(
	Id uniqueidentifier NOT NULL,
	Status varchar(1) NOT NULL,
	Name varchar(50) NOT NULL,
	Description varchar(2000) NOT NULL,
	MainImage varchar(50) NOT NULL,
	SortOrder int NULL,
	CreatedOn datetimeoffset(7) NULL,
	CreatedBy nvarchar(100) NOT NULL,
	ModifiedOn datetimeoffset(7) NULL,
	ModifiedBy nvarchar(100) NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE Extensions.Tmp_STLCategory SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_Id DEFAULT (newsequentialid()) FOR Id
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_Status DEFAULT '' FOR Status
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_Description DEFAULT '' FOR Description
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_MainImage DEFAULT '' FOR MainImage
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_CreatedOn DEFAULT (getutcdate()) FOR CreatedOn
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_CreatedBy DEFAULT ('') FOR CreatedBy
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_ModifiedOn DEFAULT (getutcdate()) FOR ModifiedOn
GO
ALTER TABLE Extensions.Tmp_STLCategory ADD CONSTRAINT
	DF_STLCategory_ModifiedBy DEFAULT ('') FOR ModifiedBy
GO
IF EXISTS(SELECT * FROM Extensions.STLCategory)
	 EXEC('INSERT INTO Extensions.Tmp_STLCategory (Id, Status, Name, Description, MainImage, SortOrder, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy)
		SELECT Id, Status, Name, Description, MainImage, SortOrder, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy FROM Extensions.STLCategory WITH (HOLDLOCK TABLOCKX)')
GO
ALTER TABLE Extensions.STLRoomLooksCategory
	DROP CONSTRAINT FK_STLRoomLooksCategory_STLRoomLooksCategory
GO
DROP TABLE Extensions.STLCategory
GO
EXECUTE sp_rename N'Extensions.Tmp_STLCategory', N'STLCategory', 'OBJECT' 
GO
ALTER TABLE Extensions.STLCategory ADD CONSTRAINT
	PK_STLCategory PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
CREATE UNIQUE NONCLUSTERED INDEX IX_STLCategory_NaturalKey ON Extensions.STLCategory
	(
	Name
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE Extensions.STLRoomLooksCategory ADD CONSTRAINT
	FK_STLRoomLooksCategory_STLRoomLooksCategory FOREIGN KEY
	(
	STLCategoryId
	) REFERENCES Extensions.STLCategory
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE Extensions.STLRoomLooksCategory SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
