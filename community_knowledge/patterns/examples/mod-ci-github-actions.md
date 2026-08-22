# 模组 CI：GitHub Actions 可复制模板

- **平台**：Forge / NeoForge / Fabric / Quilt（Gradle 工程通用）
- **Skill**：`mc-ci-publish-extra`（工作流）、`mc-build-mod`
- **MCP**：`check_publish_ready`（发布前清单）、`search_*_docs`（核对 toolchain 要求）
- **Action 版本/参数以官方 README 为准**：[actions/checkout](https://github.com/actions/checkout)、[actions/setup-java](https://github.com/actions/setup-java)、[actions/upload-artifact](https://github.com/actions/upload-artifact)

```yaml
name: Build Mod

on:
  pull_request:
  push:
    branches: [main, master]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"        # 按本档 toolchain 改：1.18.2–1.20.4=17；1.20.5+/1.21.x=21；26.x=25
          cache: gradle             # 缓存 ~/.gradle，ForgeGradle 首次下载量大

      - name: Build
        run: ./gradlew build --no-daemon

      - uses: actions/upload-artifact@v4
        with:
          name: mod-jars
          path: build/libs/*.jar
          if-no-files-found: error  # build/libs 为空时让 CI 红，不静默绿
```

## 多版本矩阵（仅当确实跨版本支持）

```yaml
    strategy:
      fail-fast: false
      matrix:
        java: ["17", "21"]
    # setup-java 的 java-version 改为 ${{ matrix.java }}，
    # artifact name 加后缀 mod-jars-java${{ matrix.java }} 防互相覆盖
```

## 坑

- Java 版本必须匹配 toolchain；多数模组只支持一条 MC 线，**固定单版本**别盲目开矩阵
- `if-no-files-found: error` 必加：默认配置下 build/libs 为空仍是绿
- ForgeGradle/Loom 首跑下载几百 MB 依赖，无缓存 CI 常超时；`cache: gradle` 或 `actions/cache` 缓存 `~/.gradle`
- 发布件以本档构建产物为准：先本地确认 `build/libs` 下哪个 jar 是发布件（Forge 老档有 reobf 产物），再定 `path`
- 上传 Curse/Modrinth 走单独 release workflow + `secrets`，tag 触发、人在环确认，不在 build CI 里做
