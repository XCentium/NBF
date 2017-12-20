#Step activation
$addJavaHome = $true # Allowed values: $true  $false
$installKopf = $true # Allowed values: $true  $false

#Cluster name
$clusterName = $null # Allowd values: $null or valid cluster name. If $null then cluster name will be elasticsearch_$hostName

#Paths
$jdkPath = 'C:\Program Files\Java\jre1.8.0_121' #path to Java Server JDK (relative to script or absolute), point to folder containing bin directory not to bin directory itself
$elasticPath = 'C:\Program Files\elasticsearch'  #path to ElasticSearch (relative to script or absolute), point to folder containing bin directory not to bin directory itself. Relative paths must not start with a \
$elasticVersion = '1.5.2' #the version of elastic search we are using