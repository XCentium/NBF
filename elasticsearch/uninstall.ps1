. .\config.ps1
try{
	$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition

	if (([System.IO.Path]::IsPathRooted($elasticPath)) -eq $false)
	{

		$elasticPath = (join-path $scriptPath $elasticPath)
	}

	$elasticBinPath = join-path $elasticPath ('\elasticsearch-' + $elasticVersion + '\bin')

	if (Get-Service "elasticsearch-service-x64" -ErrorAction SilentlyContinue)
	{
		cd $elasticBinPath
		./service.bat remove
	}
	else
	{
		Write-Host "ElasticSearch is not installed"
	}
}
finally{
	cd $scriptPath
}