Import-Module -Name ($PSScriptRoot + "\Invoke-MsBuild.psm1")
Invoke-MsBuild -Path ($PSScriptRoot + "\..\src\Extensions\Extensions.csproj") -MsBuildParameters "/t:Build /p:Configuration=Release"
if (Test-Path $PSScriptRoot + "\..\src\Extensions\bin\Release\Extensions.dll")
{ 
    Copy-Item -Path ($PSScriptRoot + "\..\src\Extensions\bin\Release\Extensions.dll") -Destination $PSScriptRoot
}
else 
{
    Copy-Item -Path ($PSScriptRoot + "\..\src\Extensions\bin\Extensions.dll") -Destination $PSScriptRoot
}