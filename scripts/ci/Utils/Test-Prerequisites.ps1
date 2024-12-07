# Test-Prerequisites.ps1
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipDependencyCheck
)

$ErrorActionPreference = 'Stop'

# Import environment settings
. "$PSScriptRoot\Set-Environment.ps1" -Environment $Environment

function Test-RequiredTools {
    Write-Host "Checking required tools..."
    
    $requiredTools = @{
        'node' = '16.0.0'
        'npm' = '7.0.0'
        'git' = '2.0.0'
    }

    foreach ($tool in $requiredTools.Keys) {
        try {
            $version = & $tool --version
            if (-not $version) {
                throw "Could not determine version"
            }
            
            Write-Host "$tool version: $version"
            
            # Version comparison logic could be added here
            # This is a simplified check
            if ($version -lt $requiredTools[$tool]) {
                Write-Warning "$tool version $version is below recommended version $($requiredTools[$tool])"
            }
        }
        catch {
            throw "Required tool '$tool' is not installed or not accessible"
        }
    }
}

function Test-NetworkConnectivity {
    Write-Host "Testing network connectivity..."
    
    $endpoints = switch ($Environment) {
        'development' {
            @(
                'localhost'
            )
        }
        'staging' {
            @(
                'staging-server',
                'staging-api.gestmarine.com',
                'staging.gestmarine.com'
            )
        }
        'production' {
            @(
                'production-server',
                'api.gestmarine.com',
                'gestmarine.com'
            )
        }
    }

    foreach ($endpoint in $endpoints) {
        if (-not (Test-Connection -ComputerName $endpoint -Count 1 -Quiet)) {
            throw "Cannot reach required endpoint: $endpoint"
        }
    }
}

function Test-Permissions {
    Write-Host "Checking required permissions..."
    
    $paths = @(
        $env:DEPLOYMENT_ROOT,
        $env:BACKUP_PATH,
        $env:BUILD_ARTIFACTS
    )

    foreach ($path in $paths) {
        if (Test-Path $path) {
            try {
                $testFile = Join-Path $path "permission_test.tmp"
                New-Item -Path $testFile -ItemType File -Force | Out-Null
                Remove-Item -Path $testFile -Force
            }
            catch {
                throw "Insufficient permissions for path: $path"
            }
        }
        else {
            try {
                New-Item -Path $path -ItemType Directory -Force | Out-Null
            }
            catch {
                throw "Cannot create directory: $path"
            }
        }
    }
}

function Test-Dependencies {
    if ($SkipDependencyCheck) {
        Write-Host "Skipping dependency check..."
        return
    }

    Write-Host "Checking project dependencies..."
    
    # Check package.json exists
    $packageJson = Join-Path $PSScriptRoot "..\..\package.json"
    if (-not (Test-Path $packageJson)) {
        throw "package.json not found at: $packageJson"
    }

    # Check node_modules
    $nodeModules = Join-Path $PSScriptRoot "..\..\node_modules"
    if (-not (Test-Path $nodeModules)) {
        throw "node_modules not found. Run 'npm install' first"
    }

    # Run npm audit
    try {
        $auditResult = npm audit --json | ConvertFrom-Json
        if ($auditResult.metadata.vulnerabilities.high -gt 0 -or $auditResult.metadata.vulnerabilities.critical -gt 0) {
            Write-Warning "Security vulnerabilities found in dependencies!"
            Write-Warning "High: $($auditResult.metadata.vulnerabilities.high)"
            Write-Warning "Critical: $($auditResult.metadata.vulnerabilities.critical)"
        }
    }
    catch {
        Write-Warning "Could not perform dependency security audit: $_"
    }
}

function Test-BuildArtifacts {
    Write-Host "Checking build artifacts..."
    
    if (-not (Test-Path $env:BUILD_ARTIFACTS)) {
        throw "Build artifacts not found at: $env:BUILD_ARTIFACTS"
    }

    # Check for essential files
    $requiredFiles = @(
        'index.html',
        'asset-manifest.json',
        'static/js/main.*.js',
        'static/css/main.*.css'
    )

    foreach ($file in $requiredFiles) {
        $files = Get-ChildItem -Path $env:BUILD_ARTIFACTS -Filter $file
        if (-not $files) {
            throw "Required build artifact not found: $file"
        }
    }
}

# Main execution
try {
    Write-Host "Running prerequisite checks for $Environment environment..."
    
    Test-RequiredTools
    Test-NetworkConnectivity
    Test-Permissions
    Test-Dependencies
    Test-BuildArtifacts
    
    Write-Host "All prerequisite checks passed successfully"
}
catch {
    Write-Error "Prerequisite check failed: $_"
    exit 1
}
