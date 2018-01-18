# This script is used to validate references for partner Extensions projects to warn them before pushing a new revision into the cloud builds if they use an invalid reference.

param (
    [Parameter(Mandatory=$True)][string]$allowedLibrariesPath,
    [Parameter(Mandatory=$True)][string]$projectPath
)

$allowedLibraries = New-Object System.Collections.ArrayList
Get-Content $allowedLibrariesPath | ForEach {
    $allowedLibraries = $allowedLibraries + $_.Split(",")
}

[xml]$csproj = Get-Content $projectPath
$references = New-Object System.Collections.ArrayList
$references.AddRange(($csproj.Project.ItemGroup | ForEach-Object {$_.Reference.Include} | Where-Object{$_ -ne $null} | ForEach-Object {$_.Split(",")[0]}))

$invalidReferences = @(Compare-Object -ReferenceObject $allowedLibraries -DifferenceObject $references | Where-Object { $_.SideIndicator -eq '=>' } | Select -ExpandProperty "InputObject")

if ($invalidReferences.Length -gt 0) {
    Write-Host " : error: Found $($invalidReferences.Length) disallowed reference(s). $($invalidReferences -join ', ')"
    Exit 1
}
