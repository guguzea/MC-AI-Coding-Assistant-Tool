#!/usr/bin/env python3
"""
Forge 1.20.1 模组项目校验工具

校验内容：
1. mods.toml 语法和必填字段（优先级高于 gradle.properties）
2. mod ID 在所有文件间的一致性
3. @Mod 注解检查（与 mods.toml modId 一致）
4. RegistryObject 命名与 static/final 修饰符
5. DeferredRegister 注册完整性（是否调用了 modEventBus）
6. 类名与文件名一致性
7. 资源文件路径完整性（单次遍历优化）

用法：
    python validate_project.py /path/to/your/mod/project
    python validate_project.py .                    # 校验当前目录
    python validate_project.py . --json           # JSON 格式输出（MCP 调用用）
    python validate_project.py . --include-crash   # 额外分析 crash-reports/
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path
from typing import Optional

# Windows GBK-safe output — no ANSI codes when terminal doesn't support them
WIN32 = sys.platform == "win32"
try:
    import colorama
    colorama.just_fix_windows_console()
    WIN32 = True
except ImportError:
    pass


def _ansi(enabled: bool, code: str) -> str:
    return code if enabled else ""


USE_ANSI = not WIN32 and sys.stdout.encoding.lower().startswith(("utf", "aix"))

GREEN  = _ansi(USE_ANSI, "\033[92m")
RED    = _ansi(USE_ANSI, "\033[91m")
YELLOW = _ansi(USE_ANSI, "\033[93m")
BOLD   = _ansi(USE_ANSI, "\033[1m")
RESET  = _ansi(USE_ANSI, "\033[0m")

PASS   = "[PASS]"
FAIL   = "[FAIL]"
WARN   = "[WARN]"


class Validator:
    def __init__(self, project_root: Path):
        self.root = project_root
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.mod_id: Optional[str] = None

    # ------------------------------------------------------------------
    # 公共 API
    # ------------------------------------------------------------------

    def run_all(self) -> dict:
        """执行所有检查，返回结构化字典（MCP 工具调用时使用）。"""
        self._check_gradle_properties()
        self._check_mods_toml()
        self._check_java_files()
        self._check_resource_paths()
        return {
            "valid": len(self.errors) == 0,
            "mod_id": self.mod_id,
            "errors": list(self.errors),
            "warnings": list(self.warnings),
            "checks": [
                "gradle.properties",
                "mods.toml（优先级最高）",
                "Java 文件",
                "资源路径",
                "@Mod 注解",
                "DeferredRegister 注册完整性",
                "类名与文件名一致性",
            ],
        }

    # ------------------------------------------------------------------
    # 1. gradle.properties 校验
    # ------------------------------------------------------------------

    def _check_gradle_properties(self):
        gp = self.root / "gradle.properties"
        if not gp.exists():
            self.errors.append(f"缺少 gradle.properties 文件（应位于 {gp}）")
            return

        props = self._parse_properties(gp)

        required = [
            "minecraft_version",
            "forge_version",
            "mod_id",
            "mod_name",
            "mod_version",
        ]
        for key in required:
            if key not in props:
                self.errors.append(f"gradle.properties 缺少必需字段：{key}")
            elif key == "mod_id":
                self.mod_id = props[key]

        # mod_id 格式检查
        if self.mod_id:
            if not re.fullmatch(r"[a-z][a-z0-9_]{0,63}", self.mod_id):
                self.errors.append(
                    f"mod_id='{self.mod_id}' 不合法，"
                    f"必须全小写，只能含字母/数字/下划线，首字符不能是数字"
                )
            if "-" in self.mod_id:
                self.errors.append(f"mod_id='{self.mod_id}' 不能含横杠（-），用下划线替代")

    # ------------------------------------------------------------------
    # 2. mods.toml 校验
    # ------------------------------------------------------------------

    def _check_mods_toml(self):
        mt = self.root / "src" / "main" / "resources" / "META-INF" / "mods.toml"
        if not mt.exists():
            self.errors.append(f"缺少 mods.toml 文件（应位于 {mt}）")
            return

        try:
            raw = mt.read_text(encoding="utf-8")
            # 移除 Gradle 占位符（${...}）
            expanded = re.sub(r"\$\{(\w+)\}", r"PLACEHOLDER_\1", raw)
            content = tomllib.loads(expanded)
        except Exception as e:
            self.errors.append(f"mods.toml 解析失败：{e}")
            return

        # 检查 mods 表
        mods = content.get("mods", [])
        if not mods:
            self.errors.append("mods.toml 中缺少 [[mods]] 表")
            return

        mod = mods[0]
        for field in ["modId", "version", "displayName", "description"]:
            if field not in mod:
                self.errors.append(f"[[mods]] 表缺少必需字段：{field}")

        # modId 优先级修正：mods.toml 为最终准
        mod_id_from_toml = mod.get("modId", "")
        if not mod_id_from_toml.startswith("PLACEHOLDER_") and mod_id_from_toml:
            self.mod_id = mod_id_from_toml  # 以 mods.toml 为准
            if not re.fullmatch(r"[a-z][a-z0-9_]*", mod_id_from_toml):
                self.errors.append(
                    f"mods.toml modId='{mod_id_from_toml}' 必须全小写、只能含字母/数字/下划线"
                )
            if "-" in mod_id_from_toml:
                self.errors.append(
                    f"mods.toml modId='{mod_id_from_toml}' 不能含横杠（-），用下划线替代"
                )
        elif mod_id_from_toml != self.mod_id and self.mod_id:
            self.warnings.append(
                f"mods.toml 中 modId='{mod_id_from_toml}' "
                f"与 gradle.properties 中的 mod_id='{self.mod_id}' 不一致，以 mods.toml 为准"
            )

        # 检查 dependencies
        deps = content.get("dependencies", {})
        if self.mod_id and self.mod_id in deps:
            forge_dep = deps[self.mod_id]
            if isinstance(forge_dep, list):
                forge_dep = forge_dep[0]
            if not forge_dep.get("mandatory"):
                self.warnings.append("forge 依赖建议 mandatory=true")
            if forge_dep.get("side", "").upper() not in ("BOTH", "CLIENT", "SERVER"):
                self.warnings.append(
                    f"dependencies[{self.mod_id}].side 建议为 BOTH/CLIENT/SERVER，"
                    f"当前为：{forge_dep.get('side')}"
                )

    # ------------------------------------------------------------------
    # 3. Java 文件校验
    # ------------------------------------------------------------------

    def _check_java_files(self):
        java_dir = self.root / "src" / "main" / "java"
        if not java_dir.exists():
            self.warnings.append("缺少 src/main/java 目录")
            return

        for java_file in java_dir.rglob("*.java"):
            self._validate_java_file(java_file)

    def _validate_java_file(self, path: Path):
        content = path.read_text(encoding="utf-8")
        rel_path = str(path.relative_to(self.root))

        # ── 类名与文件名一致性（ERROR）─────────────────────────────
        file_stem = path.stem
        class_match = re.search(r"public\s+class\s+(\w+)", content)
        if class_match:
            declared_name = class_match.group(1)
            if file_stem != declared_name:
                self.errors.append(
                    f"[{rel_path}] "
                    f"文件名 '{file_stem}.java' 与类名 '{declared_name}' 不匹配"
                )

        # ── @Mod 注解检查（ERROR）───────────────────────────────
        for match in re.finditer(r'@Mod\s*\(\s*"([^"]+)"\s*\)', content):
            mod_id_in_annotation = match.group(1)
            if self.mod_id and mod_id_in_annotation != self.mod_id:
                self.errors.append(
                    f"[{rel_path}] "
                    f"@Mod 注解 modId='{mod_id_in_annotation}' "
                    f"与 mods.toml modId='{self.mod_id}' 不一致"
                )

        # ── MOD_ID 常量检查 ───────────────────────────────────
        mod_id_matches = re.findall(
            r'public\s+static\s+final\s+String\s+MOD_ID\s*=\s*"([^"]+)"', content
        )
        for mid in mod_id_matches:
            if mid != self.mod_id and self.mod_id:
                self.warnings.append(
                    f"[{rel_path}] "
                    f"MOD_ID='{mid}' 与 mods.toml modId='{self.mod_id}' 不一致"
                )
            if not re.fullmatch(r"[a-z][a-z0-9_]*", mid):
                self.errors.append(
                    f"[{rel_path}] MOD_ID='{mid}' 不合法，"
                    f"必须全小写、只能含字母/数字/下划线"
                )

        # ── RegistryObject static/final 修饰符检查（WARN）────────
        ro_pattern = re.compile(
            r'(?:(?:private|public|protected)\s+)?'
            r'(static\s+)?'
            r'(final\s+)?'
            r'RegistryObject<\w+>\s+([A-Z_][A-Z0-9_]*)'
        )
        for m in ro_pattern.finditer(content):
            _, is_static, is_final, name = m.groups()
            if not is_static:
                self.warnings.append(
                    f"[{rel_path}] RegistryObject '{name}' 缺少 static 修饰符"
                )
            if not is_final:
                self.warnings.append(
                    f"[{rel_path}] RegistryObject '{name}' 缺少 final 修饰符"
                )

        # ── RegistryObject 命名风格检查（全大写）──────────────────
        for line_no, line in enumerate(content.splitlines(), 1):
            if "RegistryObject<" in line:
                m = re.search(r"RegistryObject<\w+>\s+([A-Z][A-Z0-9_]+)\s*=", line)
                if m:
                    name = m.group(1)
                    if not re.fullmatch(r"[A-Z][A-Z0-9_]+", name):
                        self.warnings.append(
                            f"[{rel_path}:{line_no}] "
                            f"RegistryObject 命名 '{name}' 应使用全大写下划线（如 EXAMPLE_ITEM）"
                        )

        # ── DeferredRegister 注册完整性（ERROR）───────────────────
        deferred_calls = len(re.findall(
            r'(BLOCKS|ITEMS|ENTITIES)\s*\.\s*register\s*\(\s*"[^"]+"\s*,', content
        ))
        mod_event_bus_calls = len(re.findall(
            r'(BLOCKS|ITEMS|ENTITIES)\s*\.\s*register\s*\(\s*'
            r'(FMLJavaModLoadingContext\s*\.\s*get\s*\(\s*\)\s*\.\s*getModEventBus\s*\(\s*\)|'
            r'ModLoadingContext\s*\.\s*get\s*\(\s*\)\s*\.\s*getModBus\s*\(\s*\))',
            content
        ))
        if deferred_calls > 0 and mod_event_bus_calls == 0:
            self.errors.append(
                f"[{rel_path}] 发现 {deferred_calls} 个 DeferredRegister.register() 调用，"
                f"但未找到 modEventBus 注册。"
                f"必须在 mod 构造函数中调用 BLOCKS.register(FMLJavaModLoadingContext.get().getModEventBus())"
            )
        elif deferred_calls > 0 and mod_event_bus_calls < deferred_calls:
            self.warnings.append(
                f"[{rel_path}] 发现 {deferred_calls} 个 register() 调用"
                f"但仅有 {mod_event_bus_calls} 个 modEventBus 注册，可能遗漏"
            )

        # ── Registry 名称检查（全小写）──────────────────────────
        for match in re.finditer(
            r'(BLOCKS|ITEMS|ENTITIES)\s*\.\s*register\s*\(\s*"([^"]+)"', content
        ):
            registry_name = match.group(2)
            if not re.fullmatch(r"[a-z][a-z0-9_]*", registry_name):
                self.errors.append(
                    f"[{rel_path}] "
                    f"Registry 名称 '{registry_name}' 必须全小写、下划线分隔"
                )
            if "-" in registry_name:
                self.errors.append(
                    f"[{rel_path}] "
                    f"Registry 名称 '{registry_name}' 包含横杠（-），改为下划线（_）"
                )

    # ------------------------------------------------------------------
    # 4. 资源文件路径完整性（单次遍历优化）
    # ------------------------------------------------------------------

    def _check_resource_paths(self):
        resources = self.root / "src" / "main" / "resources"
        if not resources.exists():
            self.warnings.append("缺少 resources 目录")
            return

        if not self.mod_id:
            return

        assets = resources / "assets" / self.mod_id
        data = resources / "data" / self.mod_id

        # 单次遍历同时收集 assets 和 data 文件
        all_files: list[tuple[Path, Path]] = []
        if assets.exists():
            all_files.extend((p, assets) for p in assets.rglob("*") if p.is_file())
        if data.exists():
            all_files.extend((p, data) for p in data.rglob("*") if p.is_file())

        for fp, base in all_files:
            rel = fp.relative_to(base)
            if fp.suffix == ".png" and fp.name != fp.name.lower():
                self.warnings.append(
                    f"纹理路径包含大写：{rel} → 应改为 {rel.parent / fp.name.lower()}"
                )
            elif fp.suffix == ".json" and fp.name != fp.name.lower():
                self.warnings.append(
                    f"JSON 文件包含大写：{rel} → 应改为 {rel.parent / fp.name.lower()}"
                )

    # ------------------------------------------------------------------
    # 5. 崩溃日志联动（--include-crash 参数启用）
    # ------------------------------------------------------------------

    def _check_crash_reports(self):
        crash_dir = self.root / "crash-reports"
        if not crash_dir.exists():
            return

        for crash_file in crash_dir.glob("*.txt"):
            content = crash_file.read_text(encoding="utf-8")
            if "NoClassDefFoundError" in content:
                match = re.search(r"NoClassDefFoundError:\s+(\S+)", content)
                if match:
                    self.errors.append(
                        f"崩溃日志 {crash_file.name} 中发现缺失类: {match.group(1)}"
                    )
            if "Duplicate key" in content:
                self.errors.append(
                    f"崩溃日志 {crash_file.name} 中发现重复注册：可能注册表名冲突"
                )

    # ------------------------------------------------------------------
    # 工具函数
    # ------------------------------------------------------------------

    @staticmethod
    def _parse_properties(path: Path) -> dict[str, str]:
        props: dict[str, str] = {}
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                k, v = line.split("=", 1)
                props[k.strip()] = v.strip()
        return props

    # ------------------------------------------------------------------
    # 输出
    # ------------------------------------------------------------------

    def print_report(self, result: dict | None = None):
        """打印人类可读的彩色报告，result 为 run_all() 返回的字典。"""
        if result is None:
            result = self.run_all()

        print(f"\n{BOLD}{'='*60}{RESET}")
        print(f"{BOLD}Result: {self.root.name}{RESET}\n")

        if result["errors"]:
            print(f"{BOLD}{RED}{FAIL} Errors ({len(result['errors'])}){RESET}")
            for e in result["errors"]:
                print(f"  {RED}* {e}{RESET}")

        if result["warnings"]:
            print(f"\n{BOLD}{YELLOW}{WARN} Warnings ({len(result['warnings'])}){RESET}")
            for w in result["warnings"]:
                print(f"  {YELLOW}* {w}{RESET}")

        if not result["errors"] and not result["warnings"]:
            print(f"{GREEN}{PASS} No issues found{RESET}")
        elif not result["errors"]:
            print(f"\n{GREEN}{PASS} No blocking errors{RESET}")
        else:
            print(
                f"\n{RED}{FAIL} {len(result['errors'])} error(s) — "
                f"please fix before running the mod{RESET}"
            )


def main():
    parser = argparse.ArgumentParser(
        description="Validate Forge mod project",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  python validate_project.py .                 # 校验当前目录（彩色输出）
  python validate_project.py . --json         # JSON 格式输出（MCP 调用用）
  python validate_project.py . --include-crash # 额外分析 crash-reports/
        """,
    )
    parser.add_argument(
        "project_root",
        nargs="?",
        default=".",
        help="项目根目录（默认为当前目录）",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="以 JSON 格式输出结果（MCP 工具调用时使用）",
    )
    parser.add_argument(
        "--include-crash",
        action="store_true",
        help="同时分析 crash-reports/ 目录中的崩溃日志（建议 MCP 调用时使用）",
    )
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    print(f"Validating: {project_root}")

    v = Validator(project_root)
    result = v.run_all()

    if args.include_crash:
        v._check_crash_reports()
        result = v.run_all()  # 重新生成含崩溃分析的结果

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        v.print_report(result)

    sys.exit(0 if result["valid"] else 1)


if __name__ == "__main__":
    main()
