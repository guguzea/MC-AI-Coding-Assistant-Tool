---
description: 00 — 工程（26.2）
---

# 00 — 工程（26.2）

文档：`26.2/develop_getting-started_creating-a-project`、`26.2/develop_getting-started_building-a-mod`、`26.2/develop_loader_fabric-mod-json`、`26.2/develop_loom_index`、`26.2/develop_porting_index`、`26.2/develop_getting-started_setting-up`。

## 工具链（2026-10-31 真编译实测，不是照抄模板）

| 项 | 值 | 出处 |
|---|---|---|
| Java | **25** | `26.2/develop_getting-started_setting-up:24-26`（「Install JDK 25」） |
| Gradle | **9.8.1 实测可编**（官方模板 wrapper 钉 9.8.2） | 本机 `F:\MOD_TEST\fabric262-probe` 编译通过；模板值见 `fabric-example-mod@26.2:gradle/wrapper/gradle-wrapper.properties` |
| Loom | **`1.18.2`（稳定版）实测可解析 MC 26.2**；官方 26.2 分支写 `1.19-SNAPSHOT` | 同上，`plugins { id "net.fabricmc.fabric-loom" version "1.18.2" }` + `BUILD SUCCESSFUL` |
| Loader | **`0.20.1`** | `meta.fabricmc.net/v2/versions/loader/26.2` 里唯一 `stable:true` |
| Fabric API | **`0.161.0+26.2`** | `fabric-example-mod@26.2:gradle.properties` |
| 插件 id | `net.fabricmc.fabric-loom` | `26.2/develop_porting_index`（1.21→26.1 起的改名，26.2 沿用） |
| 依赖配置 | `implementation` / `compileOnly` / `api`，**不要** `modImplementation` | 同上 |
| 任务名 | `jar` 取代 `remapJar` | 同上 |

实测的最小依赖三行：

```groovy
dependencies {
    minecraft "com.mojang:minecraft:26.2"
    implementation "net.fabricmc:fabric-loader:0.20.1"
    implementation "net.fabricmc.fabric-api:fabric-api:0.161.0+26.2"
}
```

## Decision Flow

```
→ 新建工程 → Fabric Template Mod Generator（creating-a-project）或 clone fabric-example-mod 的 26.2 分支
→ 26.1 → 26.2 移植 → 26.2/develop_porting_index：先改 gradle-wrapper / gradle.properties / build.gradle，再改代码
→ 元数据 → fabric.mod.json（26.2/develop_loader_fabric-mod-json），id 全小写（允许连字符与下划线）
→ 禁止 Yarn；禁止读 1.21.11 规则；禁止把 data/fabric_26.2 当 26.1.2 用
```
