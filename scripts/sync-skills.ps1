# =============================================================================
# MC Skill Sync — 8 IDE（版本无关）
#
# 将 .cursor/skills/ 与 .cursor/rules/ 同步到：
#   .claude/ .continue/ .trae/ .opencode/ .agents/ .zcode/ .pi/
#
# 用法：
#   .\scripts\sync-skills.ps1 -TargetDir H:\MC_skill\forge\1.19.4
#   .\scripts\sync-skills.ps1 -All
#   cd forge\1.19.4; ..\..\scripts\sync-skills.ps1 -TargetDir $PWD
#
# 各版本目录下的 sync-skills.ps1 应为对本脚本的薄包装。
# =============================================================================

[CmdletBinding()]
param(
    [string]$TargetDir = "",
    [switch]$All
)

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
    if ($PSCommandPath) {
        return [System.IO.Path]::GetFullPath((Join-Path (Split-Path $PSCommandPath -Parent) ".."))
    }
    return (Get-Location).Path
}

function Resolve-PlatformVersion {
    param([string]$Dir)
    $norm = $Dir.Replace("\", "/")
    if ($norm -match '/(forge|fabric)/(\d+\.\d+(?:\.\d+)?)/?$') {
        return @{ Platform = $Matches[1]; Version = $Matches[2]; Rel = "$($Matches[1])/$($Matches[2])" }
    }
    if ($norm -match '/neoforge/?$') {
        return @{ Platform = "neoforge"; Version = ""; Rel = "neoforge" }
    }
    return @{ Platform = ""; Version = ""; Rel = "" }
}

function Normalize-Content {
    param([string]$Text, [string]$RelPath)
    if (-not $RelPath) { return $Text }
    $escaped = [regex]::Escape($RelPath)
    # `platform/ver/.cursor/rules/XX.mdc` → `XX.mdc`
    $Text = [regex]::Replace($Text, '`' + $escaped + '/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)`', '`$1`')
    $Text = [regex]::Replace($Text, $escaped + '/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '$1')
    $Text = [regex]::Replace($Text, '参考\s+' + $escaped + '/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '参考 `$1`')
    $Text = [regex]::Replace($Text, '参见\s*`?' + $escaped + '/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)`?', '参见 `$1`')
    $Text = [regex]::Replace($Text, '→\s+参考\s+' + $escaped + '/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '→ 参考 `$1`')
    return $Text
}

function Ensure-Dir([string]$Path) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

function Write-TextRetry {
    param([string]$Path, [string]$Content, [int]$Retries = 5)
    $dir = Split-Path $Path -Parent
    if ($dir) { Ensure-Dir $dir }
    for ($i = 1; $i -le $Retries; $i++) {
        try {
            [System.IO.File]::WriteAllText($Path, $Content, [System.Text.Encoding]::UTF8)
            return
        } catch {
            if ($i -eq $Retries) { throw }
            Start-Sleep -Milliseconds (200 * $i)
        }
    }
}

function Sync-SkillContent {
    param([string]$Base, [string]$SkillName, [string]$Normalized)

    Ensure-Dir "$Base\.claude\commands"
    Ensure-Dir "$Base\.continue\skills\$SkillName"
    Ensure-Dir "$Base\.trae\skills"
    Ensure-Dir "$Base\.opencode\skills\$SkillName"
    Ensure-Dir "$Base\.agents\skills\$SkillName"
    Ensure-Dir "$Base\.zcode\skills\$SkillName"

    $claudeName = ($SkillName -replace '^mc-', '') + ".md"
    Write-TextRetry "$Base\.claude\commands\$claudeName" $Normalized
    Write-TextRetry "$Base\.continue\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.trae\skills\$SkillName.md" $Normalized
    Write-TextRetry "$Base\.opencode\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.agents\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.zcode\skills\$SkillName\SKILL.md" $Normalized
}

function Sync-VersionDir {
    param([string]$Base)

    if (-not (Test-Path "$Base\.cursor\rules")) {
        Write-Host "SKIP (no .cursor/rules): $Base" -ForegroundColor DarkGray
        return
    }

    $meta = Resolve-PlatformVersion $Base
    $rel = $meta.Rel

    Write-Host "`n=== MC Skill Sync (8 IDE) ===" -ForegroundColor Cyan
    Write-Host "Base: $Base"
    if ($rel) { Write-Host "Rel : $rel" }
    Write-Host ""

    Ensure-Dir "$Base\.claude\commands"
    Ensure-Dir "$Base\.claude\rules"
    Ensure-Dir "$Base\.claude\agents"
    Ensure-Dir "$Base\.continue\rules"
    Ensure-Dir "$Base\.continue\skills"
    Ensure-Dir "$Base\.trae\rules"
    Ensure-Dir "$Base\.trae\skills"
    Ensure-Dir "$Base\.trae\agents"
    Ensure-Dir "$Base\.opencode\skills"
    Ensure-Dir "$Base\.agents\skills"
    Ensure-Dir "$Base\.zcode\skills"
    Ensure-Dir "$Base\.pi\rules"

    # Skills
    Write-Host "[Skills] Syncing from .cursor/skills/..." -ForegroundColor Yellow
    $skillCount = 0
    $cursorSkillsDir = "$Base\.cursor\skills"
    if (Test-Path $cursorSkillsDir) {
        foreach ($skillDir in Get-ChildItem $cursorSkillsDir -Directory -ErrorAction SilentlyContinue) {
            $src = Join-Path $skillDir.FullName "SKILL.md"
            if (-not (Test-Path $src)) { continue }
            $normalized = Normalize-Content ([System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)) $rel
            Sync-SkillContent -Base $Base -SkillName $skillDir.Name -Normalized $normalized
            Write-Host "  Synced: $($skillDir.Name)" -ForegroundColor Green
            $skillCount++
        }
        foreach ($skillFile in Get-ChildItem $cursorSkillsDir -Filter "*.md" -File -ErrorAction SilentlyContinue) {
            $skillName = [System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name)
            $normalized = Normalize-Content ([System.IO.File]::ReadAllText($skillFile.FullName, [System.Text.Encoding]::UTF8)) $rel
            Sync-SkillContent -Base $Base -SkillName $skillName -Normalized $normalized
            Write-Host "  Synced: $skillName" -ForegroundColor Green
            $skillCount++
        }
    }
    Write-Host "[Skills] Done ($skillCount skills)`n" -ForegroundColor Green

    # Rules
    Write-Host "[Rules] Syncing from .cursor/rules/..." -ForegroundColor Yellow
    $ruleCount = 0
    foreach ($rule in Get-ChildItem "$Base\.cursor\rules" -Filter "*.mdc") {
        Copy-Item $rule.FullName "$Base\.claude\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.continue\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.trae\rules\$($rule.Name)" -Force

        $ruleText = [System.IO.File]::ReadAllText($rule.FullName, [System.Text.Encoding]::UTF8)
        $piName = [System.IO.Path]::GetFileNameWithoutExtension($rule.Name) + ".md"
        if ($ruleText -notmatch '(?m)^description\s*:') {
            $titleLine = ($ruleText -split "`r?`n" | Where-Object { $_ -match '^#\s+' } | Select-Object -First 1)
            $desc = if ($titleLine) { ($titleLine -replace '^#\s+', '').Trim() } else { $piName }
            if ($ruleText.StartsWith("---")) {
                $ruleText = $ruleText -replace '(?s)^---\r?\n', "---`ndescription: $desc`n"
            } else {
                $ruleText = "---`ndescription: $desc`n---`n`n" + $ruleText
            }
        }
        [System.IO.File]::WriteAllText("$Base\.pi\rules\$piName", $ruleText, [System.Text.Encoding]::UTF8)
        Write-Host "  Synced: $($rule.Name)" -ForegroundColor Green
        $ruleCount++
    }
    Write-Host "[Rules] Done ($ruleCount rules)`n" -ForegroundColor Green

    # Agents
    Write-Host "[Agents] Syncing agents..." -ForegroundColor Yellow
    $agentsSrc = "$Base\AGENTS.md"
    $agentsCursor = "$Base\.cursor\agents\default.md"
    if (Test-Path $agentsSrc) {
        Copy-Item $agentsSrc "$Base\.claude\agents\default.md" -Force
        Copy-Item $agentsSrc "$Base\.trae\agents\default.md" -Force
        Write-Host "  Synced: AGENTS.md → .claude/ & .trae/" -ForegroundColor Green
    } elseif (Test-Path $agentsCursor) {
        Copy-Item $agentsCursor "$Base\.claude\agents\default.md" -Force
        Copy-Item $agentsCursor "$Base\.trae\agents\default.md" -Force
        Write-Host "  Synced: .cursor/agents/default.md → .claude/ & .trae/" -ForegroundColor Green
    } else {
        Write-Host "  SKIP: No AGENTS.md found" -ForegroundColor DarkGray
    }
    Write-Host "  Preserved: .cursor/agents/default.md (if present)`n" -ForegroundColor DarkGray

    Write-Host "=== Sync Complete: $skillCount skills, $ruleCount rules ===" -ForegroundColor Cyan
}

# --- entry ---
$repoRoot = Get-RepoRoot

if ($All) {
    $targets = @()
    foreach ($plat in @("forge", "fabric")) {
        $platDir = Join-Path $repoRoot $plat
        if (-not (Test-Path $platDir)) { continue }
        foreach ($verDir in Get-ChildItem $platDir -Directory) {
            if ($verDir.Name -notmatch '^\d+\.\d+') { continue }
            if (Test-Path (Join-Path $verDir.FullName ".cursor\rules")) {
                $targets += $verDir.FullName
            }
        }
    }
    $nf = Join-Path $repoRoot "neoforge"
    if (Test-Path (Join-Path $nf ".cursor\rules")) { $targets += $nf }

    Write-Host "Syncing $($targets.Count) version directories..." -ForegroundColor Cyan
    foreach ($t in $targets) { Sync-VersionDir $t }
    Write-Host "`nAll done." -ForegroundColor Cyan
    return
}

if (-not $TargetDir) {
    $TargetDir = (Get-Location).Path
}
$TargetDir = [System.IO.Path]::GetFullPath($TargetDir)
Sync-VersionDir $TargetDir
