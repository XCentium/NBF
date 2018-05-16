/*
   Thursday, May 10, 20184:31:33 PM
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
ALTER TABLE Extensions.STLRoomLook
	DROP CONSTRAINT DF_STLRoomLook_Id
GO
ALTER TABLE Extensions.STLRoomLook
	DROP CONSTRAINT DF_STLRoomLook_CreatedOn
GO
ALTER TABLE Extensions.STLRoomLook
	DROP CONSTRAINT DF_STLRoomLook_CreatedBy
GO
ALTER TABLE Extensions.STLRoomLook
	DROP CONSTRAINT DF_STLRoomLook_ModifiedOn
GO
ALTER TABLE Extensions.STLRoomLook
	DROP CONSTRAINT DF_STLRoomLook_ModifiedBy
GO
CREATE TABLE Extensions.Tmp_STLRoomLook
	(
	Id uniqueidentifier NOT NULL,
	Status varchar(1) NOT NULL,
	Title varchar(50) NOT NULL,
	Description varchar(2000) NOT NULL,
	MainImage varchar(50) NOT NULL,
	SortOrder int NULL,
	CreatedOn datetimeoffset(7) NULL,
	CreatedBy nvarchar(100) NOT NULL,
	ModifiedOn datetimeoffset(7) NULL,
	ModifiedBy nvarchar(100) NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE Extensions.Tmp_STLRoomLook SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_Id DEFAULT (newsequentialid()) FOR Id
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_Status DEFAULT '' FOR Status
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_Description DEFAULT '' FOR Description
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_MainImage DEFAULT '' FOR MainImage
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_CreatedOn DEFAULT (getutcdate()) FOR CreatedOn
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_CreatedBy DEFAULT ('') FOR CreatedBy
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_ModifiedOn DEFAULT (getutcdate()) FOR ModifiedOn
GO
ALTER TABLE Extensions.Tmp_STLRoomLook ADD CONSTRAINT
	DF_STLRoomLook_ModifiedBy DEFAULT ('') FOR ModifiedBy
GO
IF EXISTS(SELECT * FROM Extensions.STLRoomLook)
	 EXEC('INSERT INTO Extensions.Tmp_STLRoomLook (Id, Status, Title, Description, MainImage, SortOrder, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy)
		SELECT Id, Status, Title, Description, MainImage, SortOrder, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy FROM Extensions.STLRoomLook WITH (HOLDLOCK TABLOCKX)')
GO
ALTER TABLE Extensions.STLRoomLooksCategory
	DROP CONSTRAINT FK_STLRoomLooksCategory_STLRoomLook
GO
ALTER TABLE Extensions.STLRoomLooksProduct
	DROP CONSTRAINT FK_STLRoomLooksProduct_STLRoomLook
GO
ALTER TABLE Extensions.STLRoomLooksStyle
	DROP CONSTRAINT FK_STLRoomLooksStyle_STLRoomLook
GO
DROP TABLE Extensions.STLRoomLook
GO
EXECUTE sp_rename N'Extensions.Tmp_STLRoomLook', N'STLRoomLook', 'OBJECT' 
GO
ALTER TABLE Extensions.STLRoomLook ADD CONSTRAINT
	PK_STLRoomLook PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
CREATE UNIQUE NONCLUSTERED INDEX IX_STLRoomLook_NaturalKey ON Extensions.STLRoomLook
	(
	Title
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE Extensions.STLRoomLooksStyle ADD CONSTRAINT
	FK_STLRoomLooksStyle_STLRoomLook FOREIGN KEY
	(
	STLRoomLookId
	) REFERENCES Extensions.STLRoomLook
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE Extensions.STLRoomLooksStyle SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE Extensions.STLRoomLooksProduct ADD CONSTRAINT
	FK_STLRoomLooksProduct_STLRoomLook FOREIGN KEY
	(
	STLRoomLookId
	) REFERENCES Extensions.STLRoomLook
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE Extensions.STLRoomLooksProduct SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE Extensions.STLRoomLooksCategory ADD CONSTRAINT
	FK_STLRoomLooksCategory_STLRoomLook FOREIGN KEY
	(
	STLRoomLookId
	) REFERENCES Extensions.STLRoomLook
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE Extensions.STLRoomLooksCategory SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
