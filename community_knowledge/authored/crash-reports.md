---
id: authored/crash-reports
title: 崩溃报告与日志
tags: [crash, fml, logs, debug, mixin]
summary: 三类日志、crash 文件名 KIND、加载期/运行期常见症状；配合 crash_analyze 与 search_community_docs。
sourceKind: authored
---

# 崩溃报告与日志

自写短文。可与 MCP `crash_analyze`（`crashKind` / `logHints`）配合。

## 三类日志

| 类型 | 典型位置 | 何时有 | 怎么用 |
|------|----------|--------|--------|
| Crash report | `crash-reports/crash-*-KIND.txt` | 崩溃瞬间 | **先看开头**：异常类型、疑似模组、Mod List |
| latest.log | `logs/latest.log` | 整局 | crash 说不清时按时间戳搜 |
| debug.log | `logs/debug.log` | 更细 | 加载顺序、注册、Mixin 细节 |

单人整合包路径可能在实例目录下；专用服在服务端根目录。

## crash 文件名 KIND

文件名形如：`crash-2024-01-01_12.00.00-fml.txt`

| KIND | 含义 | 优先排查 |
|------|------|----------|
| `fml` | 加载期 / Mod 解析 | 缺前置、版本范围、mods.toml、重复 modId |
| `client` | 客户端 | 资源包、渲染、客户端专用类 |
| `server` | 专用服 | 服务端加载了客户端代码、缺服务端依赖 |
| `integrated-server` | 单人内置服 | 逻辑侧问题，对照 client/server |
| `openGL` / rendering | 渲染 / 显卡 | 驱动、光影、资源包模型 |
| `memory` | 内存 | `-Xmx`、泄漏、实体爆炸增长 |
| `fabric` | Fabric 加载器 | Fabric 依赖与入口 |
| `java` | JVM | JDK 版本是否匹配（1.18+ 常要 17） |

`crash_analyze` 也会从正文推断 `crashKind`（即使文件名未粘贴）。

## 工作流（推荐顺序）

1. 看 KIND → 决定先查加载还是渲染/内存。  
2. 读 crash **前 30～80 行**：`Description`、`Caused by`、`System Details → Mod List`。  
3. `fml`：对照 mandatory 依赖是否都在 mods 文件夹；MC/Forge 是否在 `versionRange` 内。  
4. 堆栈含 Mixin / Capability / Dist / DeferredRegister → 调 `crash_analyze`，再查 `09-anti-patterns`。  
5. 仍不清 → 同时间戳搜 `latest.log`；还不够再 `debug.log`。  
6. 实务短文：`search_community_docs` 查「崩溃」「缺前置」。

## 加载期常见症状（多见于 -fml）

| 症状关键词 | 可能原因 | 处理方向 |
|------------|----------|----------|
| Missing or unsupported mandatory dependencies | 缺硬前置 | 安装依赖；核对 modId 拼写 |
| ModResolutionException / version range | 版本不兼容 | 换兼容构建或改 range |
| MixinTransformerError / mixin apply | 多模组改同一注入点 | 二分法禁用模组；看 mixin 配置 |
| mods.toml / ModLoadingException | 元数据错误 | modId、loaderVersion、依赖块 |
| No model for layer … | 模型路径错或次生错误 | 先确认是否上游崩溃连带 |

## 运行期常见症状

| 症状 | 可能原因 |
|------|----------|
| Unknown property 'X' on Block | BlockState 属性未 `createBlockStateDefinition` / 版本错乱 |
| ClassCastException（实体等） | 类型假设错误、实体类型注册不一致 |
| IllegalAccessError | 访问权限 / 不兼容二进制 |
| 服务端一启动就缺 client 类 | Screen/渲染放进了双方都会加载的类 |

## 内存类

- `-Xmx` 过小会 `OutOfMemoryError`；过大也可能拖垮机器。  
- 排查：实体/掉落物是否无限生成、泄漏的 Level 引用等。

## 相关

- `authored/soft-deps-modlist`、`authored/cursemaven-optional-deps`  
- 许可提炼：`permitted` 下 crash-publishing 页  

## 不清楚时

- MCP：`crash_analyze`（粘贴 crash / 日志片段）  
- 许可原文：https://www.mcmod.cn/post/3993.html  
- 平台规则：`09-anti-patterns.mdc` + `search_forge_docs`
