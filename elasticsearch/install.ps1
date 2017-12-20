param (
    [string]$configPath
)

if ($configPath -eq "") {
	$configPath = "."
}

function Restart-ScriptAsAdmin
{   
   $currentPrincipal = New-Object Security.Principal.WindowsPrincipal( [Security.Principal.WindowsIdentity]::GetCurrent() ) 
   $Invocation=((Get-Variable MyInvocation).value).ScriptName   
   if ($Invocation -eq $null -or $currentPrincipal.IsInRole( [Security.Principal.WindowsBuiltInRole]::Administrator ) ){return}
   Start-Process "$psHome\powershell.exe" -Verb Runas -ArgumentList ("-command `"& '"+$Invocation+"'`"")
   break
}
$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition
$numOfSteps = 9

function Install-ElasticSearch {
	. $configPath\config.ps1
	try {
		
        #------------------------------------
		#Set Paths to absolute if relative paths given
		#------------------------------------		
		
		if (([System.IO.Path]::IsPathRooted($jdkPath)) -eq $false)
		{
			$jdkPath = (join-path $scriptPath $jdkPath)
		}
		
		if (([System.IO.Path]::IsPathRooted($elasticPath)) -eq $false)
		{
			$elasticPath = (join-path $scriptPath $elasticPath)
		}

		$elasticBinPath = join-path $elasticPath ('\elasticsearch-' + $elasticVersion + '\bin')
		$configPath = join-path $elasticPath  ('\elasticsearch-' + $elasticVersion + '\config\elasticsearch.yml')
		$hostName = [System.Net.Dns]::GetHostName()		
		$esAreadyInstalled = $false		
		$configOK = $true

        #------------------------------------
		#Validate config
		#------------------------------------
		write-host "Validating config" -foregroundcolor green 
		if (-not (test-path $jdkPath))
		{
			$configOK = $false
			write-host "	JAVA JDK path doesn't exist: $jdkPath"  -foregroundcolor red	-background black	
		}
		
		if (-not (test-path $elasticPath))
		{
			New-Item -ItemType Directory -Force -Path $elasticPath
		}
				
		if($configOK){
			write-host "	ElasticSearch bin path: $elasticBinPath"  -foregroundcolor gray	
			write-host "	JDK path: $jdkPath"  -foregroundcolor gray	
		}
		else{
			return
		}
                
        #------------------------------------
		#Download and unzip elastic search
		#------------------------------------
        Write-Host "[1\$numOfSteps] Downloading elasticsearch" -foregroundcolor green 	
		$clnt = new-object System.Net.WebClient
        $url = "https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-" + $elasticVersion + ".zip"
        $file = "$elasticPath\elasticsearch-" + $elasticVersion + ".zip"
		$clnt.DownloadFile($url,$file)

        # Unzip the file to specified location
        Write-Host "[2\$numOfSteps] Unzipping elasticsearch" -foregroundcolor green 
        $shell_app=new-object -com shell.application
        $zip_file = $shell_app.namespace($file)
        $destination = $shell_app.namespace($elasticPath)
        $destination.Copyhere($zip_file.items())
        Remove-Item $file	
		
		#------------------------------------
		#Setting JAVA_HOME
		#------------------------------------
		Write-Host "[3\$numOfSteps] setting JAVA_HOME system variable" -foregroundcolor green 
		if ([environment]::GetEnvironmentVariable("JAVA_HOME","machine") -eq $null -and $addJavaHome)
		{
		  [environment]::setenvironmentvariable("JAVA_HOME",$jdkpath,"machine")
		  $env:JAVA_HOME = $jdkpath

		}

		Write-Host "	JAVA_HOME system variable set to: " $jdkpath -foregroundcolor gray
		
		
		#------------------------------------
		#Setting cluster name
		#------------------------------------
		Write-Host "[4\$numOfSteps] Setting cluster name" -foregroundcolor green 
		
		if($clusterName -eq $null)
		{
			$clusterName = "elasticsearch_$hostName"
		}
		(Get-Content $configPath) | ForEach-Object { $_ -replace "#?\s?cluster.name: .+" , "cluster.name: $clusterName" } | Set-Content $configPath
		 Write-Host "	Cluster name is: $clusterName"   -foregroundcolor gray	
		 
		#------------------------------------
		#Install ElasticSearch as a service
		#------------------------------------		
		Write-Host "[5\$numOfSteps] Install ElasticSearch as a service" -foregroundcolor green 
		cd $elasticBinPath 
		if (-not (Get-Service "elasticsearch-service-x64" -ErrorAction SilentlyContinue) )
		{
			.\service.bat install
			Write-Host "	ElasticSearch installed." -foregroundcolor gray
		}
		else
		{
			Write-Host "	ElasticSearch have been already installed." -foregroundcolor gray
			$esAreadyInstalled = $TRUE
		}
		 
		#------------------------------------
		#Start ElasticSearch service
		#------------------------------------			
		 Write-Host "[6\$numOfSteps] Start ElasticSearch service" -foregroundcolor green 
		 Start-Service 'elasticsearch-service-x64'
		 Write-Host "	ElasticSearch service status: " (service "elasticsearch-service-x64").Status   -foregroundcolor gray
		
		 Write-Host "[7\$numOfSteps] Set service startup type to automatic" -foregroundcolor green 
		 set-service 'elasticsearch-service-x64' -startuptype automatic
		 Write-Host "	ElasticSearch service startup type: " (Get-WmiObject -Class Win32_Service -Property StartMode -Filter "Name='elasticsearch-service-x64'").StartMode  -foregroundcolor gray
		 if(-not $esAreadyInstalled ){
			 Write-Host "	Now 20s for ElasticSearch to start"   -foregroundcolor yellow
             Wait(20)
		 }
		 Write-Host
		 
		 
		#------------------------------------
		#Sanity  check.
		#------------------------------------			 
		 Write-Host "[8\$numOfSteps] Sanity  check. " -foregroundcolor green 
		
		 $esRequest = [System.Net.WebRequest]::Create("http://localhost:9200")
		 $esRequest.Method = "GET"
		 $esResponse = $esRequest.GetResponse()
		 $reader = new-object System.IO.StreamReader($esResponse.GetResponseStream())
		 Write-Host "	ElasticSearch service response status: " $esResponse.StatusCode   -foregroundcolor gray
		 Write-Host "	ElasticSearch service response full text: " $reader.ReadToEnd()   -foregroundcolor gray
		 Write-Host

		 

		#------------------------------------
		#Install kopf.
		#------------------------------------		 
		  
		 if ($installKopf)
		 {
			Write-Host "[9\$numOfSteps] Install kopf. " -foregroundcolor green
			$kopfPath = join-path $elasticPath 'plugins\kopf'
			
			if(-not (test-path $kopfPath))
			{
				./plugin install lmenezes/elasticsearch-kopf/1.0
			}
			
			write-host "	Kopf installed: http://localhost:9200/_plugin/kopf" -foregroundcolor gray
		 }
		 else
		 {
		 	Write-Host "[8\$numOfSteps] Skipping kopf install. " -foregroundcolor green
		 }
		 Write-Host

		#------------------------------------
		#Ending notes.
		#------------------------------------		 
		 Write-Host "ElasticSerach service endopoint: http://localhost:9200" -foregroundcolor green 
		 Write-Host
		 Write-Host
		 Write-Host "Done!" -foregroundcolor green 
		

	}
	finally{
		cd $scriptPath
	}

}
function Wait($seconds)
{
    for ($i=1; $i -le ($seconds*2); $i++)
    {
        $progress = ((($i-1) / ($seconds*2))*100)

        $remaining = [math]::Ceiling($seconds-$i/2)
        Write-Progress -Activity "Waiting $seconds [s]" -status "Remianing time $remaining [s]" -percentComplete $progress
	
	    Start-Sleep -Milliseconds  500
    }
}



Install-ElasticSearch
