# =============================================================================
# MC Skill Sync Script — forge/1.20.1
#
# 将 .cursor/skills/ 和 .cursor/rules/ 中的配置同步到
# .claude/、.continue/、.trae/ 目录。
#
# 特性：
#   - 自动将 skill 文件中的 .cursor/ 路径引用替换为纯文件名
#   - Claude 命令文件命名：registry.md（非 mc-registry.md）
#   - .claude/ 和 .trae/ 的 agents/default.md 同步自 AGENTS.md
#   - .cursor/agents/default.md 保持原样（Cursor 专用内容）
#
# 用法（PowerShell）:
#   .\sync-skills.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

# Resolve base directory using .NET Path API
if ($PSCommandPath) {
    $BASE = [System.IO.Path]::GetDirectoryName($PSCommandPath)
} else {
    $BASE = $PWD.Path
}

Write-Host "=== MC Skill Sync ===" -ForegroundColor Cyan
Write-Host "Base: $BASE`n"

# -----------------------------------------------------------------------------
# Helper: Normalize content — replace .cursor/ path references with plain names
# -----------------------------------------------------------------------------
function Normalize-Content {
    param([string]$text)
    # Replace: `forge/1.20.1/.cursor/rules/XX-name.mdc` → `XX-name.mdc`
    $text = $text -replace '`forge/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)`', '`$1`'
    # Replace: forge/1.20.1/.cursor/rules/XX-name.mdc (no backticks)
    $text = $text -replace 'forge/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '$1'
    # Replace: 参考 forge/1.20.1/.cursor/rules/XX-name.mdc → 参考 `XX-name.mdc`
    $text = $text -replace '参考 forge/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '参考 `$1`'
    # Replace: 参见 `forge/1.20.1/.cursor/rules/XX-name.mdc` → 参见 `XX-name.mdc`
    $text = $text -replace '参见\s*`?forge/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)`?', '参见 `$1`'
    # Replace: 参考 forge/.../XX-name.mdc (no backticks, no space) → 参考 `XX-name.mdc`
    $text = $text -replace '参考\s+forge/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '参考 `$1`'
    # Replace:  → 参考 forge/1.20.1/.cursor/rules/XX-name.mdc  (in code blocks)
    $text = $text -replace '→\s+参考\s+forge/1\.20\.1/\.cursor/rules/(\d{2}-[a-z-]+\.mdc)', '→ 参考 `$1`'
    return $text
}

# -----------------------------------------------------------------------------
# 1. Sync Skills: .cursor/skills/*/SKILL.md → 各 IDE
# -----------------------------------------------------------------------------
Write-Host "[Skills] Syncing from .cursor/skills/..." -ForegroundColor Yellow

$cursorSkillsDir = "$BASE\.cursor\skills"
$skillCount = 0

foreach ($skillDir in Get-ChildItem $cursorSkillsDir -Directory) {
    $src = "$BASE\.cursor\skills\$($skillDir.Name)\SKILL.md"

    if (-not (Test-Path $src)) {
        Write-Host "  SKIP $($skillDir.Name) (no SKILL.md)" -ForegroundColor DarkGray
        continue
    }

    # Read (always UTF-8) & normalize
    $content = [System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)
    $normalized = Normalize-Content $content

    # .claude/commands/registry.md  (flat, 去掉 "mc-" 前缀)
    $claudeName = ($skillDir.Name -replace '^mc-', '') + ".md"
    [System.IO.File]::WriteAllText("$BASE\.claude\commands\$claudeName", $normalized, [System.Text.Encoding]::UTF8)

    # .continue/skills/mc-xxx/SKILL.md  (子目录结构)
    New-Item -ItemType Directory -Force -Path "$BASE\.continue\skills\$($skillDir.Name)" | Out-Null
    [System.IO.File]::WriteAllText("$BASE\.continue\skills\$($skillDir.Name)\SKILL.md", $normalized, [System.Text.Encoding]::UTF8)

    # .trae/skills/mc-xxx.md  (flat, 保留 mc- 前缀)
    [System.IO.File]::WriteAllText("$BASE\.trae\skills\$($skillDir.Name).md", $normalized, [System.Text.Encoding]::UTF8)

    Write-Host "  Synced: $($skillDir.Name)" -ForegroundColor Green
    $skillCount++
}

Write-Host "[Skills] Done ($skillCount skills)`n" -ForegroundColor Green

# -----------------------------------------------------------------------------
# 2. Sync Rules: .cursor/rules/*.mdc → 各 IDE
# -----------------------------------------------------------------------------
Write-Host "[Rules] Syncing from .cursor/rules/..." -ForegroundColor Yellow

$cursorRulesDir = "$BASE\.cursor\rules"
$ruleCount = 0

foreach ($rule in Get-ChildItem $cursorRulesDir -Filter "*.mdc") {
    Copy-Item $rule.FullName "$BASE\.claude\rules\$($rule.Name)" -Force
    Copy-Item $rule.FullName "$BASE\.continue\rules\$($rule.Name)" -Force
    Copy-Item $rule.FullName "$BASE\.trae\rules\$($rule.Name)" -Force
    Write-Host "  Synced: $($rule.Name)" -ForegroundColor Green
    $ruleCount++
}

Write-Host "[Rules] Done ($ruleCount rules)`n" -ForegroundColor Green

# -----------------------------------------------------------------------------
# 3. Sync Agents: .claude/ 和 .trae/ 使用 AGENTS.md
#    .cursor/agents/default.md 保持原样，不同步
# -----------------------------------------------------------------------------
Write-Host "[Agents] Syncing agents..." -ForegroundColor Yellow

New-Item -ItemType Directory -Force -Path "$BASE\.claude\agents" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE\.trae\agents" | Out-Null

$agentsSrc = "$BASE\AGENTS.md"
$agentsCursor = "$BASE\.cursor\agents\default.md"

if (Test-Path $agentsSrc) {
    $srcFile = $agentsSrc
} elseif (Test-Path $agentsCursor) {
    $srcFile = $agentsCursor
} else {
    $srcFile = $null
}

if ($srcFile) {
    Copy-Item $srcFile "$BASE\.claude\agents\default.md" -Force
    Copy-Item $srcFile "$BASE\.trae\agents\default.md" -Force
    Write-Host "  Synced: $(Split-Path $srcFile -Leaf) → .claude/ & .trae/`n" -ForegroundColor Green
} else {
    Write-Host "  SKIP: No AGENTS.md or .cursor/agents/default.md found`n" -ForegroundColor DarkGray
}

Write-Host "  Preserved: .cursor/agents/default.md (Cursor-only content, not synced)`n" -ForegroundColor DarkGray

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
Write-Host "=== Sync Complete ===" -ForegroundColor Cyan
Write-Host "  Skills : $skillCount"
Write-Host "  Rules  : $ruleCount"
Write-Host ""
Write-Host "Modified directories:" -ForegroundColor Cyan
Write-Host "  .claude/commands/  (flat, path references normalized)"
Write-Host "  .claude/rules/     (.mdc)"
Write-Host "  .claude/agents/    (synced from AGENTS.md)"
Write-Host "  .continue/skills/  (subdirectory, path references normalized)"
Write-Host "  .continue/rules/   (.mdc)"
Write-Host "  .trae/skills/      (flat, path references normalized)"
Write-Host "  .trae/rules/       (.mdc)"
Write-Host "  .trae/agents/      (synced from AGENTS.md)"
Write-Host ""
Write-Host "Preserved (not synced):" -ForegroundColor Cyan
Write-Host "  .cursor/agents/default.md  (Cursor-specific role definition)"
