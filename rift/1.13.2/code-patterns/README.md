# Rift 1.13.2 代码模式库

> 本目录收集 **Rift 1.13.2** 模组开发的代码片段。
> **口径**：Rift 侧（`org.dimdev.rift.**`）的每个类名/签名都对真构件 `javap` 核过（出处 `../knowledge/common/verified-api.md`）；
> **MC 侧（`net.minecraft.**`）没有对真构件核过**（本机无 1.13.2 构件）⇒ 凡涉及 MC 类型的地方都标了 `TODO(未核实)`，**别当已证**。

## 目录

| 文件 | 内容 |
|------|------|
| `listener-pattern.md` | listener 机制 + 骨架 + 按用途分类的接口清单 + `riftmod.json` |
| `gradle-recipe.md` | Gradle 配方（`tweaker-client` / `tweakClass` / 依赖取法）+ 实测坑位 |

---

## 与 Forge 心智模型的三处根本差异（先看这个，再写代码）

| 维度 | Forge | **Rift 1.13.2** |
|---|---|---|
| 入口声明 | `@Mod(modid=…)` 注解 + `mods.toml` | **`riftmod.json` 的 `listeners[]` 列 FQCN**，无注解 |
| 生命周期 | `@Mod` 构造器 + `FMLInitializationEvent` 等 | **实现 listener 接口**，由 Rift 回调（无构造器注入、无事件类） |
| 事件系统 | `MinecraftForge.EVENT_BUS` | **没有事件总线**；要拦 vanilla 行为得用 **Mixin**（`InitializationListener#onInitialization()` 里注册） |

⇒ **从 Forge 迁过来的人最常犯的错**：在 Rift 里找 `@Mod` / `EVENT_BUS` / `FMLxxxEvent` —— 这三样**本档都不存在**。

## 核心 import（Rift 侧，已 javap 核过）

```java
// tick（客户端）
import org.dimdev.rift.listener.client.ClientTickable;
// tick（服务端）
import org.dimdev.rift.listener.ServerTickable;
// 早期初始化（做 Mixin / ClassFileTransformer 时）
import org.dimdev.riftloader.listener.InitializationListener;
// 注册类目（registerItems / registerBlocks / …）
import org.dimdev.rift.listener.ItemAdder;
import org.dimdev.rift.listener.BlockAdder;
```

## 通用约定

- 一个 jar 里**只应有一份 `riftmod.json`**；要多个 mod 就各自打成独立 jar。
- listener 接口可以**一个类同时实现多个**，Rift 会分别回调。
- 方法名/参数**逐字照 `../knowledge/common/verified-api.md`**，那是 javap 真构件表。
- MC 类型（`Minecraft` / `Registry` / `Block` / `Item` …）**本档未对真构件核**，改前先 `search_docs platform=rift version=1.13.2` 或对自备的 1.13.2 构件 `javap`。