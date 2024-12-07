# Deploy-Staging.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$BuildVersion,
    
    [Parameter(Mandatory=$false)]
    [string]$DeploymentPath = "\\staging-server\deployments",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,

    [Parameter(Mandatory=$false)]
    [int]$BackupRetentionDays = 7
)

$ErrorActionPreference = 'Stop'
$deploymentTimestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = Join-Path $DeploymentPath "backups"
$buildArtifactsPath = Join-Path $PSScriptRoot "..\..\build"

# Import common functions
. "$PSScriptRoot\..\Utils\Common-Functions.ps1"

function Test-DeploymentPrerequisites {
    Write-Host "Checking deployment prerequisites..."
    
    if (-not (Test-Path $DeploymentPath)) {
        throw "Deployment path '$DeploymentPath' does not exist"
    }
    
    if (-not (Test-Path $buildArtifactsPath)) {
        throw "Build artifacts not found at '$buildArtifactsPath'"
    }

    # Check if staging environment is available
    try {
        $pingResult = Test-Connection -ComputerName "staging-server" -Count 1 -Quiet
        if (-not $pingResult) {
            throw "Cannot reach staging server"
        }
    }
    catch {
        throw "Failed to verify staging server availability: $_"
    }
}

function Backup-ExistingDeployment {
    Write-Host "Creating backup of existing deployment..."
    
    if (-not (Test-Path $backupPath)) {
        New-Item -Path $backupPath -ItemType Directory -Force | Out-Null
    }

    $currentDeployment = Join-Path $DeploymentPath "current"
    if (Test-Path $currentDeployment) {
        $backupDestination = Join-Path $backupPath "backup_${deploymentTimestamp}"
        Copy-Item -Path $currentDeployment -Destination $backupDestination -Recurse -Force
        Write-Host "Backup created at: $backupDestination"
    }

    # Cleanup old backups
    Get-ChildItem -Path $backupPath -Directory | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$BackupRetentionDays) } |
        ForEach-Object {
            Write-Host "Removing old backup: $($_.FullName)"
            Remove-Item $_.FullName -Recurse -Force
        }
}

function Start-Deployment {
    Write-Host "Starting deployment process..."
    
    $deploymentTarget = Join-Path $DeploymentPath "current"
    
    # Create new deployment directory
    $newDeployment = Join-Path $DeploymentPath "deploy_${deploymentTimestamp}"
    New-Item -Path $newDeployment -ItemType Directory -Force | Out-Null

    try {
        # Copy build artifacts to new deployment directory
        Copy-Item -Path "$buildArtifactsPath\*" -Destination $newDeployment -Recurse -Force
        
        # Update environment-specific configuration
        $envConfig = Join-Path $newDeployment "config.staging.json"
        if (Test-Path $envConfig) {
            Copy-Item -Path $envConfig -Destination (Join-Path $newDeployment "config.json") -Force
        }

        # Switch to new deployment
        if (Test-Path $deploymentTarget) {
            Remove-Item -Path $deploymentTarget -Force
        }
        New-Item -Path $deploymentTarget -ItemType SymbolicLink -Value $newDeployment | Out-Null

        Write-Host "Deployment completed successfully"
        Write-Host "New deployment path: $newDeployment"
    }
    catch {
        Write-Error "Deployment failed: $_"
        if (Test-Path $newDeployment) {
            Remove-Item -Path $newDeployment -Recurse -Force
        }
        throw
    }
}

function Test-Deployment {
    Write-Host "Verifying deployment..."
    
    $healthCheckUrl = "https://staging.gestmarine.com/health"
    $maxRetries = 5
    $retryDelay = 10

    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $healthCheckUrl -Method GET
            if ($response.StatusCode -eq 200) {
                Write-Host "Deployment health check passed"
                return
            }
        }
        catch {
            Write-Warning "Health check attempt $i of $maxRetries failed"
            if ($i -lt $maxRetries) {
                Start-Sleep -Seconds $retryDelay
            }
        }
    }
    
    throw "Deployment verification failed after $maxRetries attempts"
}

# Main execution
try {
    Write-Host "Starting staging deployment for version: $BuildVersion"
    
    Test-DeploymentPrerequisites
    Backup-ExistingDeployment
    Start-Deployment
    Test-Deployment
    
    Write-Host "Deployment completed successfully"
}
catch {
    Write-Error "Deployment failed: $_"
    exit 1
}
