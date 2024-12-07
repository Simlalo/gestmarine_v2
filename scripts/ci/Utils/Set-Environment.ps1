# Set-Environment.ps1
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment
)

$ErrorActionPreference = 'Stop'

function Set-EnvironmentVariables {
    Write-Host "Setting environment variables for $Environment environment..."
    
    # Base URLs
    switch ($Environment) {
        'development' {
            $env:API_URL = 'http://localhost:3000'
            $env:APP_URL = 'http://localhost:3001'
            $env:NODE_ENV = 'development'
        }
        'staging' {
            $env:API_URL = 'https://staging-api.gestmarine.com'
            $env:APP_URL = 'https://staging.gestmarine.com'
            $env:NODE_ENV = 'staging'
        }
        'production' {
            $env:API_URL = 'https://api.gestmarine.com'
            $env:APP_URL = 'https://gestmarine.com'
            $env:NODE_ENV = 'production'
        }
    }

    # Common variables
    $env:DEPLOYMENT_TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
    $env:LOG_LEVEL = if ($Environment -eq 'development') { 'debug' } else { 'info' }
}

function Set-DeploymentPaths {
    Write-Host "Setting deployment paths..."
    
    switch ($Environment) {
        'development' {
            $env:DEPLOYMENT_ROOT = "C:\Development\GestMarine\deployments"
        }
        'staging' {
            $env:DEPLOYMENT_ROOT = "\\staging-server\deployments"
        }
        'production' {
            $env:DEPLOYMENT_ROOT = "\\production-server\deployments"
        }
    }

    $env:BACKUP_PATH = Join-Path $env:DEPLOYMENT_ROOT "backups"
    $env:CURRENT_DEPLOYMENT = Join-Path $env:DEPLOYMENT_ROOT "current"
    $env:BUILD_ARTIFACTS = Join-Path $PSScriptRoot "..\..\build"
}

function Set-SecuritySettings {
    Write-Host "Configuring security settings..."
    
    # SSL/TLS Configuration
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    # Environment-specific security settings
    switch ($Environment) {
        'development' {
            $env:ENABLE_DEBUG = 'true'
            $env:CORS_ORIGINS = 'http://localhost:3000,http://localhost:3001'
        }
        'staging' {
            $env:ENABLE_DEBUG = 'false'
            $env:CORS_ORIGINS = 'https://staging.gestmarine.com'
        }
        'production' {
            $env:ENABLE_DEBUG = 'false'
            $env:CORS_ORIGINS = 'https://gestmarine.com'
        }
    }
}

function Initialize-Logging {
    Write-Host "Initializing logging..."
    
    $logPath = Join-Path $env:DEPLOYMENT_ROOT "logs"
    if (-not (Test-Path $logPath)) {
        New-Item -Path $logPath -ItemType Directory -Force | Out-Null
    }

    $env:LOG_PATH = $logPath
    $env:LOG_FILE = Join-Path $logPath "deployment_${env:DEPLOYMENT_TIMESTAMP}.log"
}

function Test-EnvironmentAccess {
    Write-Host "Testing environment access..."
    
    switch ($Environment) {
        'staging' {
            if (-not (Test-Connection -ComputerName "staging-server" -Count 1 -Quiet)) {
                throw "Cannot access staging server"
            }
        }
        'production' {
            if (-not (Test-Connection -ComputerName "production-server" -Count 1 -Quiet)) {
                throw "Cannot access production server"
            }
        }
    }
}

# Main execution
try {
    Write-Host "Initializing $Environment environment..."
    
    Set-EnvironmentVariables
    Set-DeploymentPaths
    Set-SecuritySettings
    Initialize-Logging
    
    if ($Environment -ne 'development') {
        Test-EnvironmentAccess
    }
    
    Write-Host "Environment setup completed successfully"
}
catch {
    Write-Error "Environment setup failed: $_"
    exit 1
}
