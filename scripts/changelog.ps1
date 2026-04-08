[CmdletBinding()]
param (
  [string]$From,
  [string]$To = 'HEAD',
  [Parameter(Mandatory = $true)][string]$OutputDir
)

$DestFile = "$(Join-Path -Path $OutputDir -ChildPath "$To.md")"

$BaseUrl = "$(git remote get-url origin)" -replace '.github.io.git', ''
$ChangelogDate = git log -1 --format="%cI" "$To"

$SectionHeaders = [ordered]@{
  docs     = '### 📖 Documentation'
  examples = '### 🏀 Examples'
  feat     = '### 🚀 Enhancements'
  perf     = '### 🔥 Performance'
  fix      = '### 🩹 Fixes'
  types    = '### 🌊 Types'
  refactor = '### 💅 Refactors'
  style    = '### 🎨 Styles'
  chore    = '### 🏡 Chore'
  test     = '### ✅ Tests'
  build    = '### 📦 Build'
  ci       = '### 🤖 CI'
  misc     = '### ♻️ Misc'
}

$Commits = git --no-pager log "$($From ? "$From..." : '')$To" --pretty=format:"%h`t%s" |
ConvertFrom-Csv -Delimiter "`t" -Header 'Hash', 'Message' |
ForEach-Object {
  $Group = $_.Message -replace '(.+?): (.*)', '$1'

  if ($SectionHeaders.Keys -notcontains $Group) {
    $Group = 'misc'
  }

  @{
    Hash    = $_.Hash
    Group   = $Group
    Message = $_.Message -replace '(.+?): (.*)', '$2'
  }
} |
Group-Object -Property 'Group' |
Sort-Object -Property @{ Expression = { [Array]::IndexOf($SectionHeaders.Keys, $_.Name) } }

$ChangelogHeader = @"
---
date: $ChangelogDate
versionName:
---

[compare changes]($BaseUrl/compare/$From...$To)
"@

$ChangelogHeader | Out-File $DestFile -Encoding 'UTF8'

$Commits |
ForEach-Object {
  $CommitGroup = $SectionHeaders.$($_.Name)

  "`n$CommitGroup`n" | Out-File $DestFile -Encoding 'UTF8' -Append

  $_.Group |
  ForEach-Object {
    $Hash = $_.Hash
    $Message = $_.Message

    "- $Message ([$Hash]($BaseUrl/commit/$Hash))" | Out-File $DestFile -Encoding 'UTF8' -Append
  }
}
