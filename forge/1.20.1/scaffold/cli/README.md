# CLI 校验工具说明

## 用途

在 AI 生成代码后，用本工具自动检查常见错误，确保代码可以编译运行。

## 环境要求

- **Python 3.11+**（内置 `tomllib`，无需额外安装依赖）
- Windows / macOS / Linux 通用

## 使用方法

### 命令行

```bash
# 校验当前目录
python validate_project.py .

# 校验指定目录
python validate_project.py /path/to/your/mod/project

# Windows 快捷方式
validate_project.bat .
```

### 在 Cursor 中调用

让 AI 在生成代码后执行：

```
请运行 `python forge/1.20.1/scaffold/cli/validate_project.py .` 进行自查。
```

工具返回问题列表，AI 根据报告修复后再次生成。

## 校验项目

| 类别 | 检查内容 |
|------|----------|
| `mods.toml` | 必填字段、依赖声明、格式 |
| mod ID 一致性 | `gradle.properties` ↔ `mods.toml` ↔ Java 代码 |
| Registry 命名 | 全部小写、无横杠、RegistryObject 全大写下划线 |
| 资源文件路径 | 纹理和 JSON 文件名全小写 |

## 退出码

- `0` — 无错误，校验通过
- `1` — 存在错误，校验失败

## 扩展

如需添加新校验规则，在 `validate_project.py` 的 `Validator` 类中添加 `_check_xxx()` 方法，并在 `run_all()` 中调用即可。
