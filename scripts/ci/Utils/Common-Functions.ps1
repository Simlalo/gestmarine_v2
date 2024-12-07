# Common deployment functions

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('Info', 'Warning', 'Error')]
        [string]$Level = 'Info'
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp - $Message"
    
    switch ($Level) {
        'Info'    { Write-Host $logMessage }
        'Warning' { Write-Warning $logMessage }
        'Error'   { Write-Error $logMessage }
    }
}

function Test-AdminRights {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Confirm-Path {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
        Write-Log "Created directory: $Path"
    }
}

function Backup-Path {
    param(
        [string]$Path,
        [string]$BackupRoot,
        [int]$RetentionDays = 7
    )
    
    if (Test-Path $Path) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupPath = Join-Path $BackupRoot "backup_$timestamp"
        Copy-Item -Path $Path -Destination $backupPath -Recurse -Force
        Write-Log "Created backup at: $backupPath"
        return $backupPath
    }
    return $null
}

function Remove-OldBackups {
    param(
        [string]$BackupPath,
        [int]$RetentionDays = 7
    )
    
    Get-ChildItem -Path $BackupPath -Directory |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
        ForEach-Object {
            Write-Log "Removing old backup: $($_.FullName)"
            Remove-Item $_.FullName -Recurse -Force
        }
}
