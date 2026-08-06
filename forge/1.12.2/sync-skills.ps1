# Thin wrapper → repo scripts/sync-skills.ps1 (8 IDE)
$ErrorActionPreference = "Stop"
$here = if ($PSCommandPath) { [System.IO.Path]::GetDirectoryName($PSCommandPath) } else { $PWD.Path }
& ([System.IO.Path]::GetFullPath((Join-Path $here "..\..\scripts\sync-skills.ps1"))) -TargetDir $here