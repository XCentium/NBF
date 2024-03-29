IF EXISTS ( SELECT  1 FROM  sys.objects WHERE   object_id = OBJECT_ID(N'nbfRebuildSearchIndex') AND type IN ( N'P', N'PC' ) ) 
	DROP PROCEDURE nbfRebuildSearchIndex
GO

CREATE PROCEDURE nbfRebuildSearchIndex
(@UserName varchar(50))
AS
BEGIN
	SET NOCOUNT ON
	
	DECLARE 
		@StartTime datetime = GETDATE(),
		-- Wait a max of 6 hours
		@MaxRunSec INT = 6 * 3600,
		@RunningJobId UniqueIdentifier = NEWID(),
		@ScheduleJobNumber INT,
		@ErrorMsg VARCHAR(500),
		@JobStatus varchar(50) = 'Queued',
		@JobName varchar(150) = 'Rebuild Search Index'

	SET @RunningJobId = 
		(
			SELECT TOP 1 IJ.ID
			FROM IntegrationJob IJ (NOLOCK)
			JOIN JobDefinition JD (NOLOCK) ON JD.ID = IJ.JobDefinitionId
			WHERE JD.Name = @JobName
			AND IJ.EndDateTime IS NULL
		)
	IF @RunningJobId IS NOT NULL
	BEGIN
		SET @ErrorMsg = 'Product Rebuild Search Index has already scheduled';
		RAISERROR(@ErrorMsg,11,1);
	END
		-- USE TRANSACTION

	ELSE

	BEGIN

		BEGIN TRY 
			BEGIN TRANSACTION
			-- Schedule The integratio job for the Rebuild Search Index
			INSERT [IntegrationJob]
					([JobDefinitionId]
					,[Status]
					,[ScheduleDateTime]
					,[CreatedBy]
					,[ModifiedBy]
					,[IsActive]
					)
			SELECT 
				jd.Id		--JobDefinitionId
				,@JobStatus	--Status
				,SYSDATETIMEOFFSET()  --ScheduleDateTime
				,@UserName --CreatedBy
				,@UserName --ModifiedBy
				,1 --IsActive
			FROM JobDefinition jd (NOLOCK)
			WHERE jd.name = @JobName

			SET @ScheduleJobNumber = @@IDENTITY;

			INSERT [IntegrationJobParameter]
					([IntegrationJobId]
					,[JobDefinitionStepParameterId]
					,[Value]
					,[CreatedBy]
					,[ModifiedBy]
					,[JobDefinitionParameterId])
			SELECT
				IJ.Id [IntegrationJobId]
				,NULL [JobDefinitionStepParameterId]
				--Make PartialRebuild False it is always defaulted as FullRebuild	
				,CASE WHEN JDP.Name = 'PartialRebuild' THEN 'False' ELSE '' END Value
				,@UserName CreatedBy
				,@UserName ModifiedBy
				,JDP.Id [JobDefinitionParameterId]
			FROM JobDefinition JD (NOLOCK)
			JOIN [JobDefinitionParameter] JDP (NOLOCK) ON JDP.[JobDefinitionId] = JD.Id
			JOIN [IntegrationJob] IJ (NOLOCK) ON JD.ID = IJ.JobDefinitionId
			WHERE jd.name = @JobName AND IJ.JobNumber = @ScheduleJobNumber
			COMMIT TRANSACTION
		END TRY
		BEGIN CATCH
			PRINT ERROR_MESSAGE()
			IF @@TRANCOUNT > 0
				ROLLBACK TRANSACTION --RollBack in case of Error
			THROW;
		END CATCH;
	
		-- Wait until is job is completed with timout of 6 hours
		SET @RunningJobId = NULL;
		WHILE @RunningJobId IS NULL
		BEGIN
			SET @RunningJobId = 
			(
				SELECT TOP 1 IJ.ID
				FROM IntegrationJob IJ (NOLOCK)
				WHERE IJ.JobNumber = @ScheduleJobNumber
					AND IJ.EndDateTime IS NOT NULL
			)

			IF @RunningJobID IS NULL
			BEGIN
				IF DATEDIFF(SECOND, @StartTime, GETDATE()) < @MaxRunSec
				BEGIN
					WAITFOR DELAY '00:05'
				END
				ELSE
				BEGIN
					BREAK
				END
			END
		END	--WHILE END

		IF @RunningJobId IS NULL
		BEGIN
			-- this means that the rebuild is taking longer because it didn't start until someone starts using the site
			-- the jobs don't get picked up if there is no activity on the website
			SET @ErrorMsg = 'Wait for Product Reindexing to complete took more than ' + CAST(@MaxRunSec AS VARCHAR(10)) + ' seconds'
			RAISERROR(@ErrorMsg,11,1);
		END	--Raise Error End

	END
END