# Deploy-Production.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$BuildVersion,
    
    [Parameter(Mandatory=$false)]
    [string]$DeploymentPath = "\\production-server\deployments",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,

    [Parameter(Mandatory=$false)]
    [int]$BackupRetentionDays = 30
)

$ErrorActionPreference = 'Stop'
$deploymentTimestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = Join-Path $DeploymentPath "backups"
$buildArtifactsPath = Join-Path $PSScriptRoot "..\..\build"

# Import common functions
. "$PSScriptRoot\..\Utils\Common-Functions.ps1"

function Test-DeploymentPrerequisites {
    Write-Host "Checking production deployment prerequisites..."
    
    # Verify build version exists in staging
    $stagingDeployment = "\\staging-server\deployments\versions\$BuildVersion"
    if (-not (Test-Path $stagingDeployment)) {
        throw "Build version $BuildVersion not found in staging"
    }

    # Verify production server availability
    try {
        $pingResult = Test-Connection -ComputerName "production-server" -Count 1 -Quiet
        if (-not $pingResult) {
            throw "Cannot reach production server"
        }
    }
    catch {
        throw "Failed to verify production server availability: $_"
    }

    # Additional production-specific checks
    if (-not $Force) {
        $confirmation = Read-Host "Are you sure you want to deploy to production? (yes/no)"
        if ($confirmation -ne "yes") {
            throw "Deployment cancelled by user"
        }
    }
}

function Backup-ExistingDeployment {
    Write-Host "Creating backup of existing production deployment..."
    
    if (-not (Test-Path $backupPath)) {
        New-Item -Path $backupPath -ItemType Directory -Force | Out-Null
    }

    $currentDeployment = Join-Path $DeploymentPath "current"
    if (Test-Path $currentDeployment) {
        $backupDestination = Join-Path $backupPath "backup_${deploymentTimestamp}"
        Copy-Item -Path $currentDeployment -Destination $backupDestination -Recurse -Force
        Write-Host "Production backup created at: $backupDestination"
    }

    # Cleanup old backups but keep more history for production
    Get-ChildItem -Path $backupPath -Directory | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$BackupRetentionDays) } |
        ForEach-Object {
            Write-Host "Removing old backup: $($_.FullName)"
            Remove-Item $_.FullName -Recurse -Force
        }
}

function Start-Deployment {
    Write-Host "Starting production deployment process..."
    
    $deploymentTarget = Join-Path $DeploymentPath "current"
    $newDeployment = Join-Path $DeploymentPath "deploy_${deploymentTimestamp}"
    
    try {
        # Create new deployment directory
        New-Item -Path $newDeployment -ItemType Directory -Force | Out-Null

        # Copy build artifacts
        Copy-Item -Path "$buildArtifactsPath\*" -Destination $newDeployment -Recurse -Force
        
        # Update production configuration
        $prodConfig = Join-Path $newDeployment "config.production.json"
        if (Test-Path $prodConfig) {
            Copy-Item -Path $prodConfig -Destination (Join-Path $newDeployment "config.json") -Force
        }

        # Perform blue-green deployment
        $blueDeployment = Join-Path $DeploymentPath "blue"
        $greenDeployment = Join-Path $DeploymentPath "green"

        # Determine current active deployment
        $currentColor = if (Test-Path $deploymentTarget) {
            (Get-Item $deploymentTarget).Target -match "blue$" ? "blue" : "green"
        } else {
            "blue"
        }

        # Deploy to inactive color
        $targetColor = if ($currentColor -eq "blue") { "green" } else { "blue" }
        $targetPath = Join-Path $DeploymentPath $targetColor

        if (Test-Path $targetPath) {
            Remove-Item -Path $targetPath -Recurse -Force
        }
        Copy-Item -Path $newDeployment -Destination $targetPath -Recurse -Force

        # Switch traffic to new deployment
        if (Test-Path $deploymentTarget) {
            Remove-Item -Path $deploymentTarget -Force
        }
        New-Item -Path $deploymentTarget -ItemType SymbolicLink -Value $targetPath | Out-Null

        Write-Host "Production deployment completed successfully"
        Write-Host "New deployment path: $targetPath"
    }
    catch {
        Write-Error "Production deployment failed: $_"
        if (Test-Path $newDeployment) {
            Remove-Item -Path $newDeployment -Recurse -Force
        }
        throw
    }
}

function Test-Deployment {
    Write-Host "Verifying production deployment..."
    
    $healthCheckUrl = "https://gestmarine.com/health"
    $maxRetries = 10
    $retryDelay = 15

    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $healthCheckUrl -Method GET
            if ($response.StatusCode -eq 200) {
                Write-Host "Production health check passed"
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
    
    throw "Production deployment verification failed after $maxRetries attempts"
}

# Main execution
try {
    Write-Host "Starting production deployment for version: $BuildVersion"
    
    Test-DeploymentPrerequisites
    Backup-ExistingDeployment
    Start-Deployment
    Test-Deployment
    
    Write-Host "Production deployment completed successfully"
}
catch {
    Write-Error "Production deployment failed: $_"
    exit 1
}
