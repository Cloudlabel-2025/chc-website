$ErrorActionPreference = 'Stop'
# One sign-in attempt against the user-requested production site. Never print
# credentials, session cookies, or the authenticated user's details.
$credentialsJson = & node -e "require('@next/env').loadEnvConfig(process.cwd());process.stdout.write(JSON.stringify({username:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD}))"
if ($LASTEXITCODE -ne 0) { throw 'Unable to load local admin configuration.' }
$credentials = $credentialsJson | ConvertFrom-Json
if (-not $credentials.username -or -not $credentials.password) { throw 'Local ADMIN_EMAIL and ADMIN_PASSWORD must be configured.' }
$siteOrigin = 'https://cloudheard.org'
$csrf = Invoke-RestMethod -Uri "$siteOrigin/api/auth/csrf" -SessionVariable loginSession -MaximumRedirection 0 -TimeoutSec 30
$result = Invoke-RestMethod -Uri "$siteOrigin/api/auth/callback/credentials" -Method Post -WebSession $loginSession -MaximumRedirection 0 -TimeoutSec 60 -Headers @{ 'X-Auth-Return-Redirect' = '1'; Origin = $siteOrigin } -Body @{
  username = $credentials.username
  password = $credentials.password
  csrfToken = $csrf.csrfToken
  callbackUrl = "$siteOrigin/admin/dashboard"
}
$resultUri = [Uri]$result.url
Add-Type -AssemblyName System.Web
$query = [System.Web.HttpUtility]::ParseQueryString($resultUri.Query)
$session = Invoke-RestMethod -Uri "$siteOrigin/api/auth/session" -WebSession $loginSession -MaximumRedirection 0 -TimeoutSec 30
[pscustomobject]@{
  Error = $query['error']
  Code = $query['code']
  SessionCreated = [bool]$session.user.id
} | ConvertTo-Json
