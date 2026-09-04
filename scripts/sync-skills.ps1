# =============================================================================
# MC Skill Sync — 规则/技能镜像（版本无关）
#
# 权威源稿只在 .cursor/skills/ 与 .cursor/rules/。本脚本同步到：
#   rules : .claude/ .continue/ .trae/ .opencode/ .agents/ .zcode/ .pi/
#   skills: 上述 + .pi/skills（.claude 走 commands/ 扁平 md）
#
# Codex：本脚本**不写** `.codex/rules`。Codex 只读该档 `AGENTS.md`
# （platform-pack write 可写入 AGENTS）；规则正文以 `.cursor/rules` 源稿为准，
# 不要默默加第八套 rules 树。
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
    if ($norm -match '/(forge|fabric|quilt|liteloader|rift|modloader|neoforge)/(\d+\.\d+(?:\.\d+)?)/?$') {
        return @{ Platform = $Matches[1]; Version = $Matches[2]; Rel = "$($Matches[1])/$($Matches[2])" }
    }
    if ($norm -match '/neoforge/?$') {
        return @{ Platform = "neoforge"; Version = ""; Rel = "neoforge" }
    }
    if ($norm -match '/bedrock/?$') {
        return @{ Platform = "bedrock"; Version = ""; Rel = "bedrock" }
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
    # 此处原另有三条「参考/参见/→ 参考 + 路径 → 反引号包名」规则（2026-09-04 删）。两条独立理由让它们永远跑不到：
    #   ① 上面那条裸路径规则已把同一段文本改光，前置词的匹配面为空（实测 1291 个 skills 源稿 0 处活输入）；
    #   ② 本脚本无 BOM，PowerShell 5.1 按 ANSI(GBK) 解码，中文字面量匹配不到 UTF-8 正文（探针：加 BOM 才 REPL）。
    # 条款集必须与 mcp-server/scripts/assert-skill-mirrors.mjs 的 normalizePathRefs 保持一致，
    # 由 mcp-server/scripts/assert-sync-normalizers.mjs 逐 fixture 差分钉住（只在一侧加规则 = 立刻红）。
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
            [System.IO.File]::WriteAllText($Path, $Content, (New-Object System.Text.UTF8Encoding $false))
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
    Ensure-Dir "$Base\.pi\skills\$SkillName"

    $claudeName = ($SkillName -replace '^mc-', '') + ".md"
    Write-TextRetry "$Base\.claude\commands\$claudeName" $Normalized
    Write-TextRetry "$Base\.continue\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.trae\skills\$SkillName.md" $Normalized
    Write-TextRetry "$Base\.opencode\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.agents\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.zcode\skills\$SkillName\SKILL.md" $Normalized
    Write-TextRetry "$Base\.pi\skills\$SkillName\SKILL.md" $Normalized
}

function Sync-VersionDir {
    param([string]$Base)

    if (-not (Test-Path "$Base\.cursor\rules")) {
        Write-Host "SKIP (no .cursor/rules): $Base" -ForegroundColor DarkGray
        return
    }

    $meta = Resolve-PlatformVersion $Base
    $rel = $meta.Rel

    # Legacy neoforge root pack (empty Version) = trap; see neoforge/LEGACY-NOTICE.md.
    # Current packs are neoforge/<ver>/; the root must never gain projections.
    if ($meta.Platform -eq "neoforge" -and -not $meta.Version) {
        Write-Host "REFUSE: $Base is the legacy neoforge root pack (see neoforge/LEGACY-NOTICE.md); sync neoforge/<version>/ instead." -ForegroundColor Red
        return
    }

    Write-Host "`n=== MC Skill Sync (cursor → claude/continue/trae/opencode/agents/zcode/pi) ===" -ForegroundColor Cyan
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
    Ensure-Dir "$Base\.opencode\rules"
    Ensure-Dir "$Base\.agents\skills"
    Ensure-Dir "$Base\.agents\rules"
    Ensure-Dir "$Base\.zcode\skills"
    Ensure-Dir "$Base\.zcode\rules"
    Ensure-Dir "$Base\.pi\rules"
    Ensure-Dir "$Base\.pi\skills"

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

    $cursorSkillNames = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
    if (Test-Path $cursorSkillsDir) {
        foreach ($skillDir in Get-ChildItem $cursorSkillsDir -Directory -ErrorAction SilentlyContinue) {
            [void]$cursorSkillNames.Add($skillDir.Name)
        }
        foreach ($skillFile in Get-ChildItem $cursorSkillsDir -Filter "*.md" -File -ErrorAction SilentlyContinue) {
            [void]$cursorSkillNames.Add([System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name))
        }
    }
    foreach ($hostSkills in @(
        @{ Path = "$Base\.continue\skills"; Kind = "dir" },
        @{ Path = "$Base\.opencode\skills"; Kind = "dir" },
        @{ Path = "$Base\.agents\skills"; Kind = "dir" },
        @{ Path = "$Base\.zcode\skills"; Kind = "dir" },
        @{ Path = "$Base\.pi\skills"; Kind = "dir" }
    )) {
        if (-not (Test-Path $hostSkills.Path)) { continue }
        foreach ($item in Get-ChildItem $hostSkills.Path -Directory -ErrorAction SilentlyContinue) {
            if (-not $cursorSkillNames.Contains($item.Name)) {
                Remove-Item $item.FullName -Recurse -Force
                Write-Host "  Removed extra skill: $($item.FullName)" -ForegroundColor DarkYellow
            }
        }
    }
    $traeSkills = "$Base\.trae\skills"
    if (Test-Path $traeSkills) {
        foreach ($f in Get-ChildItem $traeSkills -Filter "*.md" -File -ErrorAction SilentlyContinue) {
            $n = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
            if (-not $cursorSkillNames.Contains($n)) {
                Remove-Item $f.FullName -Force
                Write-Host "  Removed extra skill: $($f.FullName)" -ForegroundColor DarkYellow
            }
        }
    }
    $claudeCmds = "$Base\.claude\commands"
    if (Test-Path $claudeCmds) {
        foreach ($f in Get-ChildItem $claudeCmds -Filter "*.md" -File -ErrorAction SilentlyContinue) {
            $stem = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
            if (-not ($cursorSkillNames.Contains($stem) -or $cursorSkillNames.Contains("mc-$stem"))) {
                Remove-Item $f.FullName -Force
                Write-Host "  Removed extra command: $($f.FullName)" -ForegroundColor DarkYellow
            }
        }
    }

    # Rules
    Write-Host "[Rules] Syncing from .cursor/rules/..." -ForegroundColor Yellow
    $ruleCount = 0
    foreach ($rule in Get-ChildItem "$Base\.cursor\rules" -Filter "*.mdc") {
        Copy-Item $rule.FullName "$Base\.claude\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.continue\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.trae\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.opencode\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.agents\rules\$($rule.Name)" -Force
        Copy-Item $rule.FullName "$Base\.zcode\rules\$($rule.Name)" -Force

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
        [System.IO.File]::WriteAllText("$Base\.pi\rules\$piName", $ruleText, (New-Object System.Text.UTF8Encoding $false))
        Write-Host "  Synced: $($rule.Name)" -ForegroundColor Green
        $ruleCount++
    }
    Write-Host "[Rules] Done ($ruleCount rules)`n" -ForegroundColor Green

    $cursorRuleNames = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
    foreach ($rule in Get-ChildItem "$Base\.cursor\rules" -Filter "*.mdc" -ErrorAction SilentlyContinue) {
        [void]$cursorRuleNames.Add($rule.Name)
    }
    foreach ($hostDir in @(".claude", ".continue", ".trae", ".opencode", ".agents", ".zcode")) {
        $p = "$Base\$hostDir\rules"
        if (-not (Test-Path $p)) { continue }
        foreach ($f in Get-ChildItem $p -Filter "*.mdc" -File -ErrorAction SilentlyContinue) {
            if (-not $cursorRuleNames.Contains($f.Name)) {
                Remove-Item $f.FullName -Force
                Write-Host "  Removed extra rule: $($f.FullName)" -ForegroundColor DarkYellow
            }
        }
    }
    $piRules = "$Base\.pi\rules"
    if (Test-Path $piRules) {
        foreach ($f in Get-ChildItem $piRules -Filter "*.md" -File -ErrorAction SilentlyContinue) {
            $want = [System.IO.Path]::GetFileNameWithoutExtension($f.Name) + ".mdc"
            if (-not $cursorRuleNames.Contains($want)) {
                Remove-Item $f.FullName -Force
                Write-Host "  Removed extra rule: $($f.FullName)" -ForegroundColor DarkYellow
            }
        }
    }

    # Agents：AGENTS.md 为权威，覆盖 .cursor/agent/default.md（单数 agent）并镜像到 .claude/.trae
    Write-Host "[Agents] Syncing agents..." -ForegroundColor Yellow
    $agentsSrc = "$Base\AGENTS.md"
    $agentsCursor = "$Base\.cursor\agent\default.md"
    if (Test-Path $agentsSrc) {
        Ensure-Dir "$Base\.cursor\agent"
        Copy-Item $agentsSrc $agentsCursor -Force
        Ensure-Dir "$Base\.claude\agents"
        Ensure-Dir "$Base\.trae\agents"
        Copy-Item $agentsSrc "$Base\.claude\agents\default.md" -Force
        Copy-Item $agentsSrc "$Base\.trae\agents\default.md" -Force
        Write-Host "  Synced: AGENTS.md → .cursor/agent/default.md + .claude/ & .trae/" -ForegroundColor Green
    } elseif (Test-Path $agentsCursor) {
        Ensure-Dir "$Base\.claude\agents"
        Ensure-Dir "$Base\.trae\agents"
        Copy-Item $agentsCursor "$Base\.claude\agents\default.md" -Force
        Copy-Item $agentsCursor "$Base\.trae\agents\default.md" -Force
        Write-Host "  Synced: .cursor/agent/default.md → .claude/ & .trae/" -ForegroundColor Green
    } else {
        Write-Host "  SKIP: No AGENTS.md found" -ForegroundColor DarkGray
    }
    Write-Host "  Authority: AGENTS.md → .cursor/agent/default.md`n" -ForegroundColor DarkGray

    $claudeSrc = "$Base\CLAUDE.md"
    if (Test-Path $claudeSrc) {
        Ensure-Dir "$Base\.claude"
        Copy-Item $claudeSrc "$Base\.claude\CLAUDE.md" -Force
        Write-Host "  Synced: CLAUDE.md → .claude/CLAUDE.md" -ForegroundColor Green
    }

    Write-Host "=== Sync Complete: $skillCount skills, $ruleCount rules ===" -ForegroundColor Cyan
}

# --- entry ---
$repoRoot = Get-RepoRoot

if ($All) {
    $targets = @()
    foreach ($plat in @("forge", "fabric", "quilt", "liteloader", "rift", "modloader", "neoforge")) {
        $platDir = Join-Path $repoRoot $plat
        if (-not (Test-Path $platDir)) { continue }
        foreach ($verDir in Get-ChildItem $platDir -Directory) {
            if ($verDir.Name -notmatch '^\d+\.\d+') { continue }
            if (Test-Path (Join-Path $verDir.FullName ".cursor\rules")) {
                $targets += $verDir.FullName
            }
        }
    }
    # The neoforge/ ROOT pack is the legacy trap (neoforge/LEGACY-NOTICE.md): live packs are neoforge/<ver>/.
    # Its 7 projection trees were deleted on purpose, so -All must never nominate the root again --
    # one sync would regenerate the whole legacy tree from stale sources.
    $be = Join-Path $repoRoot "bedrock"
    if (Test-Path (Join-Path $be ".cursor\rules")) { $targets += $be }

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
