# Rollback-Deployment.ps1
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('staging', 'production')]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$BackupId,
    
    [Parameter(Mandatory=$false)]
    [switch]$UseLatestBackup
)

$ErrorActionPreference = 'Stop'

# Set environment-specific paths
$deploymentPath = if ($Environment -eq 'production') {
    "\\production-server\deployments"
} else {
    "\\staging-server\deployments"
}

$backupPath = Join-Path $deploymentPath "backups"
$currentDeployment = Join-Path $deploymentPath "current"

# Import common functions
. "$PSScriptRoot\..\Utils\Common-Functions.ps1"

function Get-LatestBackup {
    $backups = Get-ChildItem -Path $backupPath -Directory |
        Sort-Object LastWriteTime -Descending
    
    if (-not $backups) {
        throw "No backups found in $backupPath"
    }
    
    return $backups[0]
}

function Get-SpecificBackup {
    param([string]$backupId)
    
    $backup = Get-ChildItem -Path $backupPath -Directory |
        Where-Object { $_.Name -match $backupId }
    
    if (-not $backup) {
        throw "Backup with ID '$backupId' not found in $backupPath"
    }
    
    return $backup
}

function Test-RollbackPrerequisites {
    Write-Host "Checking rollback prerequisites..."
    
    if (-not (Test-Path $backupPath)) {
        throw "Backup path '$backupPath' does not exist"
    }

    # Verify server availability
    $serverName = if ($Environment -eq 'production') { "production-server" } else { "staging-server" }
    try {
        $pingResult = Test-Connection -ComputerName $serverName -Count 1 -Quiet
        if (-not $pingResult) {
            throw "Cannot reach $serverName"
        }
    }
    catch {
        throw "Failed to verify server availability: $_"
    }
}

function Start-Rollback {
    param([System.IO.DirectoryInfo]$backupDirectory)
    
    Write-Host "Starting rollback process to backup: $($backupDirectory.Name)"
    
    $rollbackTimestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $rollbackPath = Join-Path $deploymentPath "rollback_${rollbackTimestamp}"
    
    try {
        # Create rollback directory
        New-Item -Path $rollbackPath -ItemType Directory -Force | Out-Null
        
        # Copy backup to rollback directory
        Copy-Item -Path "$($backupDirectory.FullName)\*" -Destination $rollbackPath -Recurse -Force
        
        # Switch current deployment to rollback
        if (Test-Path $currentDeployment) {
            Remove-Item -Path $currentDeployment -Force
        }
        New-Item -Path $currentDeployment -ItemType SymbolicLink -Value $rollbackPath | Out-Null
        
        Write-Host "Rollback completed successfully"
        Write-Host "Rolled back to: $rollbackPath"
    }
    catch {
        Write-Error "Rollback failed: $_"
        if (Test-Path $rollbackPath) {
            Remove-Item -Path $rollbackPath -Recurse -Force
        }
        throw
    }
}

function Test-Rollback {
    Write-Host "Verifying rollback..."
    
    $healthCheckUrl = if ($Environment -eq 'production') {
        "https://gestmarine.com/health"
    } else {
        "https://staging.gestmarine.com/health"
    }
    
    $maxRetries = if ($Environment -eq 'production') { 10 } else { 5 }
    $retryDelay = if ($Environment -eq 'production') { 15 } else { 10 }

    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $healthCheckUrl -Method GET
            if ($response.StatusCode -eq 200) {
                Write-Host "Rollback health check passed"
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
    
    throw "Rollback verification failed after $maxRetries attempts"
}

# Main execution
try {
    Write-Host "Starting rollback process for $Environment environment"
    
    Test-RollbackPrerequisites
    
    $backupToUse = if ($BackupId) {
        Get-SpecificBackup -backupId $BackupId
    } elseif ($UseLatestBackup) {
        Get-LatestBackup
    } else {
        throw "Either -BackupId or -UseLatestBackup must be specified"
    }
    
    # Confirm rollback
    if ($Environment -eq 'production') {
        $confirmation = Read-Host "Are you sure you want to rollback production to $($backupToUse.Name)? (yes/no)"
        if ($confirmation -ne "yes") {
            throw "Rollback cancelled by user"
        }
    }
    
    Start-Rollback -backupDirectory $backupToUse
    Test-Rollback
    
    Write-Host "Rollback completed successfully"
}
catch {
    Write-Error "Rollback failed: $_"
    exit 1
}
