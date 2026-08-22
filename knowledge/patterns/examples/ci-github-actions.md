平台：Forge / NeoForge / Fabric / Quilt（Gradle 工程通用） · 依赖：`mc-ci-publish-extra` 工作流、`check_publish_ready` · 社区正稿：`community_knowledge/patterns/examples/mod-ci-github-actions.md`（验收以社区库为准）

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
          java-version: "21"        # 按本档 toolchain：1.18.2–1.20.4=17；1.20.5+/1.21.x=21；26.x=25
          cache: gradle
      - name: Build
        run: ./gradlew build --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: mod-jars
          path: build/libs/*.jar
          if-no-files-found: error
```

常见坑：Java 版本匹配 toolchain（多数模组固定单版本别开矩阵）；`if-no-files-found: error` 防静默绿；ForgeGradle/Loom 首跑下载量大必须开 gradle 缓存；发布走独立 release workflow + secrets（人在环），不在 build CI 里做。
