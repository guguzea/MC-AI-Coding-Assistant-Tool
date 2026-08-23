---
id: authored/testing-automation
title: 模组自动化测试（JUnit / GameTest 选型）
tags: [testing, junit, gametest, ci, client]
summary: 非 GameTest 的自动化测试实务：JUnit 单测何时可行、三 loader 的 test 配置要点、客户端渲染类的现实测试路径与可测性设计清单。
sourceKind: authored
---

# 模组自动化测试（JUnit / GameTest 选型）

自写实务短文。GameTest 语法与各档入口见 `mc-gametest` Skill（`activate_platform_pack task=mc-gametest`）；本文补「GameTest 之外」的部分。API 细节以本档 `search_*_docs` 为准，不复制签名。

## 选型 Decision

| 测什么 | 用什么 | 为什么 |
|--------|--------|--------|
| 纯逻辑（配方计算、NBT 组装、数据类、数学） | **JUnit**（`src/test/java`） | 不需要启动游戏，秒级反馈，可进 CI |
| 注册表联动 / 世界交互 / 方块实体行为 | **GameTest**（游戏内集成） | 只有真实注册表与世界能验证 |
| 渲染 / GUI 视觉 | 手动清单 + 可选截图对比；无官方自动化框架 | vanilla 无渲染测试钩子，见下文 |
| 网络包序列化 | JUnit（对 `FriendlyByteBuf`/`RegistryFriendlyByteBuf` 的读写往返） | 只需 buf 与注册表参数，不必启动客户端 |

## JUnit：能测的只有「干净逻辑」

- 判据：这段代码能否在**不引入 Minecraft 启动**的前提下跑起来？能 → JUnit；不能 → GameTest 或手动。
- 典型可测目标：`static` 数学/工具函数、配方成分求解、自定义数据结构、事件处理里的纯计算分支。
- 典型不可测目标：`DeferredRegister` 产物、`Level`/`Player` 依赖、客户端 `Minecraft.getInstance()` 路径。

## build.gradle test 配置要点（按 loader）

- **Forge（ForgeGradle）**：`test { useJUnitPlatform() }` + `dependencies { testImplementation 'org.junit.jupiter:junit-jupiter:5.x' }`（版本以 Maven Central 当前为准）；ForgeGradle 会对 test 源集做重映射，`net.minecraft` 类在单测里可用但**注册表未引导**——只测不依赖 bootstrap 的路径。
- **NeoForge（MDG/NG）**：同 JUnit 5 骨架；官方模板自带 `test` 配置口径，以本档 `search_neoforge_docs` 为准。
- **Fabric/Quilt（Loom）**：同骨架；Yarn 工程注意 test 源集映射与主源集一致，`fabric-loader` 不在单测里初始化。
- 三家共同点：**不要**在单测里触发 mod 初始化（注册/事件订阅），那是 GameTest 的领域。

## 可测性设计清单

1. 把决策逻辑抽成纯函数/纯类（输入输出显式，不藏 `Level` 引用）。
2. 注册对象只做「查表」，不做计算——计算留在可注入的类里。
3. 网络包把「编码/解码」与「处理」分离，前者可直接 JUnit。
4. 事件监听器薄壳化：收事件 → 调纯逻辑 → 写结果。

## 客户端渲染类的现实路径

- 无官方自动化渲染测试；可行做法：GameTest 里放结构+实体再人工/截图核对，或 CI 只跑 `gradlew build`（编译即回归下限）+ datagen 输出 diff。
- GUI 逻辑可测的部分是「数据与状态机」，抽出来 JUnit；`Screen` 只留绘制。

## 常见错误

- ❌ 在 JUnit 里调 `DeferredRegister.getEntries()` 断言注册——注册表没引导，结果无意义。
- ❌ 用 `main` 源集里直接 `new Level` 之类幻想 API——不存在。
- ❌ 把 GameTest 当单测跑本地全量——GameTest 要起 dev 客户端/服务端，分钟级，留给 CI 或手动。
- ❌ CI 里既没 `test` 任务也没 GameTest，只有 build——那不是自动化测试。

## 参考与扩展点

- `mc-gametest` Skill（GameTest 语法与本档入口）；`mc-ci-publish-extra` 工作流与 `patterns/examples/mod-ci-github-actions.md`（把 `gradlew test` 加进 CI）。
- JUnit 5：<https://junit.org/junit5/>；各 loader 测试口径以本档 `search_*_docs` 命中页为准。
