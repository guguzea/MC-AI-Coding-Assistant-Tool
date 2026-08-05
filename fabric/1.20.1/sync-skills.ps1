# =============================================================================
# MC Skill Sync Script — fabric/1.20.1
#
# 将 .cursor/skills/ 和 .cursor/rules/ 中的配置同步到
# .claude/、.continue/、.trae/、.opencode/、.agents/、.zcode/、.pi/ 目录。
#
# Fabric 此版本 skills 为扁平 .md（非子目录 SKILL.md）。
#
# 用法（PowerShell）:
#   .\sync-skills.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

if ($PSCommandPath) {
    $BASE = [System.IO.Path]::GetDirectoryName($PSCommandPath)
} else {
    $BASE = $PWD.Path
}

Write-Host "=== MC Skill Sync (Fabric 1.20.1) ===" -ForegroundColor Cyan
Write-Host "Base: $BASE`n"

function Normalize-Content {
    param([string]$text)
    $text = $text -replace '`fabric/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)`', '`$1`'
    $text = $text -replace 'fabric/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '$1'
    $text = $text -replace '参考 fabric/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '参考 `$1`'
    $text = $text -replace '参见\s*`?fabric/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)`?', '参见 `$1`'
    $text = $text -replace '参考\s+fabric/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '参考 `$1`'
    $text = $text -replace '→\s+参考\s+fabric/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '→ 参考 `$1`'
    return $text
}

function Sync-SkillContent {
    param([string]$skillName, [string]$normalized)

    New-Item -ItemType Directory -Force -Path "$BASE\.claude\commands" | Out-Null
    New-Item -ItemType Directory -Force -Path "$BASE\.continue\skills\$skillName" | Out-Null
    New-Item -ItemType Directory -Force -Path "$BASE\.trae\skills" | Out-Null

    $claudeName = ($skillName -replace '^mc-', '') + ".md"
    [System.IO.File]::WriteAllText("$BASE\.claude\commands\$claudeName", $normalized, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText("$BASE\.continue\skills\$skillName\SKILL.md", $normalized, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText("$BASE\.trae\skills\$skillName.md", $normalized, [System.Text.Encoding]::UTF8)

    New-Item -ItemType Directory -Force -Path "$BASE\.opencode\skills\$skillName" | Out-Null
    [System.IO.File]::WriteAllText("$BASE\.opencode\skills\$skillName\SKILL.md", $normalized, [System.Text.Encoding]::UTF8)
    New-Item -ItemType Directory -Force -Path "$BASE\.agents\skills\$skillName" | Out-Null
    [System.IO.File]::WriteAllText("$BASE\.agents\skills\$skillName\SKILL.md", $normalized, [System.Text.Encoding]::UTF8)
    New-Item -ItemType Directory -Force -Path "$BASE\.zcode\skills\$skillName" | Out-Null
    [System.IO.File]::WriteAllText("$BASE\.zcode\skills\$skillName\SKILL.md", $normalized, [System.Text.Encoding]::UTF8)
}

Write-Host "[Skills] Syncing from .cursor/skills/..." -ForegroundColor Yellow
$cursorSkillsDir = "$BASE\.cursor\skills"
$skillCount = 0

if (Test-Path $cursorSkillsDir) {
    foreach ($skillDir in Get-ChildItem $cursorSkillsDir -Directory -ErrorAction SilentlyContinue) {
        $src = Join-Path $skillDir.FullName "SKILL.md"
        if (-not (Test-Path $src)) { continue }
        $normalized = Normalize-Content ([System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8))
        Sync-SkillContent -skillName $skillDir.Name -normalized $normalized
        Write-Host "  Synced: $($skillDir.Name)" -ForegroundColor Green
        $skillCount++
    }
    foreach ($skillFile in Get-ChildItem $cursorSkillsDir -Filter "*.md" -File -ErrorAction SilentlyContinue) {
        $skillName = [System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name)
        $normalized = Normalize-Content ([System.IO.File]::ReadAllText($skillFile.FullName, [System.Text.Encoding]::UTF8))
        Sync-SkillContent -skillName $skillName -normalized $normalized
        Write-Host "  Synced: $skillName" -ForegroundColor Green
        $skillCount++
    }
}

Write-Host "[Skills] Done ($skillCount skills)`n" -ForegroundColor Green

Write-Host "[Rules] Syncing from .cursor/rules/..." -ForegroundColor Yellow
$cursorRulesDir = "$BASE\.cursor\rules"
$ruleCount = 0
New-Item -ItemType Directory -Force -Path "$BASE\.claude\rules" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE\.continue\rules" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE\.trae\rules" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE\.pi\rules" | Out-Null

foreach ($rule in Get-ChildItem $cursorRulesDir -Filter "*.mdc") {
    Copy-Item $rule.FullName "$BASE\.claude\rules\$($rule.Name)" -Force
    Copy-Item $rule.FullName "$BASE\.continue\rules\$($rule.Name)" -Force
    Copy-Item $rule.FullName "$BASE\.trae\rules\$($rule.Name)" -Force

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
    [System.IO.File]::WriteAllText("$BASE\.pi\rules\$piName", $ruleText, [System.Text.Encoding]::UTF8)
    Write-Host "  Synced: $($rule.Name)" -ForegroundColor Green
    $ruleCount++
}

Write-Host "[Rules] Done ($ruleCount rules)`n" -ForegroundColor Green

Write-Host "[Agents] Syncing agents..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$BASE\.claude\agents" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE\.trae\agents" | Out-Null
$agentsSrc = "$BASE\AGENTS.md"
$agentsCursor = "$BASE\.cursor\agent\default.md"
if (-not (Test-Path $agentsCursor)) { $agentsCursor = "$BASE\.cursor\agents\default.md" }

if (Test-Path $agentsSrc) {
    Copy-Item $agentsSrc "$BASE\.claude\agents\default.md" -Force
    Copy-Item $agentsSrc "$BASE\.trae\agents\default.md" -Force
    Write-Host "  Synced: AGENTS.md → .claude/ & .trae/`n" -ForegroundColor Green
} elseif (Test-Path $agentsCursor) {
    Copy-Item $agentsCursor "$BASE\.claude\agents\default.md" -Force
    Copy-Item $agentsCursor "$BASE\.trae\agents\default.md" -Force
    Write-Host "  Synced: cursor agent → .claude/ & .trae/`n" -ForegroundColor Green
} else {
    Write-Host "  SKIP: No AGENTS.md found`n" -ForegroundColor DarkGray
}

Write-Host "=== Sync Complete ===" -ForegroundColor Cyan
Write-Host "  Skills : $skillCount"
Write-Host "  Rules  : $ruleCount"
Write-Host "  .opencode / .agents / .zcode / .pi included"
