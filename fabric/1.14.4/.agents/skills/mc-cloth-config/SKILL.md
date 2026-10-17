---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---
<!-- external-apis: cloth-config, jdk -->

<!-- cloth-version-inject v=1.14.4 coord=TODO(未核实) state=todo textApi=constructor -->

# Cloth Config（Fabric 1.14.4）

## 概述

Cloth Config 是 Fabric 侧广泛使用的**第三方**配置库（不是 Fabric 官方组件，也没有「官方推荐」这一说），提供类型安全的配置系统与配置 GUI。

**本档没有已核实的 Cloth Config 坐标与 API 面**：`maven.shedaniel.me` 的 `cloth-config-fabric/maven-metadata.xml`（126 条）最低版本是 `4.10.11`，落在 1.16 线；没有 1.14.4 档的构件可取证，本包也没有该库的 API 摘要。⇒ 本档不提供可抄的 Cloth 代码；动手前必须让用户自备该版本的 cloth-config jar，走 `ingest_loader_api` 入库后逐签名回填。

## 添加依赖

```groovy
// build.gradle
dependencies {
    modApi "me.shedaniel.cloth:cloth-config-fabric:TODO(未核实)" { // 本档无已核实坐标：4.10.11 起才进 maven-metadata，属 1.16 线；禁止抄别的版本档
        exclude group: "net.fabricmc.fabric-api"
    }
}
```

## 本档禁止默写

- 本档没有可抄的配置类 / 配置屏幕代码：任何类名与方法名都必须先有该版本 jar 的 javap 或 `ingest_loader_api` 摘要。
- 常见于旧稿、但在本档构件范围内无法证实的历史名字（`ClothConfig` / `ClothConfigAddon` / `ClothConfigBuilder` / `ClothConfigScreenBuilder` / `ConfigSerializable` / `BoolOption` / `IntSliderOption` / `EntryBuilder` / `createBuilder` / `getOrCreateModConfig` / `setDefaultTitle` / `setGlobalErrorSupplier` / `setNewDefaultValue`）一律 **未核实**，不要写进工程。
- 现代 Cloth（4.x 起）的真实 API 形状可参考 `fabric/1.16.5` / `1.17.1` 档的 `mc-cloth-config`，但**不许**把那些版本锁定值或签名直接搬到 1.14.4。

## 常见错误

- ❌忘记 `exclude group: "net.fabricmc.fabric-api"` — 依赖冲突
- ❌在服务端创建配置屏幕 — 配置屏幕是客户端的
- ❌忘记在 `fabric.mod.json` 中声明 cloth-config 依赖

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Cloth Config 提供配置 GUI |
| `mc-registry` | 配置通过 Registry 持久化 |
