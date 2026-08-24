---
id: authored/forge-event-system-practices
title: Forge 事件系统实务（双总线、订阅方式与常见坑）
tags: [events, SubscribeEvent, EventBus, EventBusSubscriber, lifecycle, enqueueWork, IMC, forge, neoforge]
summary: Forge 事件系统实务：双总线分工（Mod 总线管初始化/Forge 总线管运行期）；订阅三式（实例手动注册、@Mod.EventBusSubscriber 自动、bus 参数选总线）；生命周期事件并行与 enqueueWork 回主线程；IMC 跨模组；泛型事件监听父类收全部子类；Event 基类 cancel/phase。
mcHint: 锚定 Forge 1.18–1.20.x 双总线形态（社区教程 2571 全文核实；该帖未声明协议，本文为自写综述、未复制原文表达）；NeoForge 新版形态有差异，以当档文档为准
sourceKind: authored
---

# Forge 事件系统实务

自写短文。核心内容依据 mcmod 教程《浅谈 Forge 的事件系统和使用》（[post/2571](https://www.mcmod.cn/post/2571.html)，64 段+194 代码块全文通读后综合；**该帖列表与帖页均未声明协议（2026-08-24 复核），本文为自写综述、只取思路不复制原文表达**），跨版本差异部分采用保守表述。事件是模组开发的核心概念之一——本篇是跨版本实务总览，**各版本的准确事件名/签名以对应版本档规则 `05-events` 与 `search_forge_docs` 为准**。

## 心智模型：原版没有事件，这是加载器给的扩展点

原版 MC 没有事件系统；Forge 通过事件总线让你在特定时机插入逻辑——注册、世界生成、玩家行为、渲染，覆盖面极广。写模组的第一课就是分清「什么时机用什么事件、挂在哪条总线」。

## 双总线分工（经典 Forge 形态，1.18–1.20.x）

| 总线 | 获取方式 | 负责什么 |
|------|----------|----------|
| **Forge 总线** | `MinecraftForge.EVENT_BUS` | 除生命周期外的一切运行期事件（玩家行为、方块交互、掉落……） |
| **Mod 总线** | `FMLJavaModLoadingContext.get().getModEventBus()` | 模组初始化生命周期（FMLCommonSetup、FMLClientSetup/DedicatedServerSetup、RegisterEvent 等） |

经验法则：**初始化期间该处理的事 → Mod 总线；游戏运行期 → Forge 总线**。

## 订阅三式

```java
// ① 实例方法 + 手动注册到 Forge 总线
public class MyHandler {
    @SubscribeEvent
    public void onPickup(EntityItemPickupEvent e) { /* 监听的事件由参数类型决定 */ }
}
MinecraftForge.EVENT_BUS.register(new MyHandler());   // 通常在主类初始化里

// ② 静态方法 + 自动注册（最常用）
@Mod.EventBusSubscriber(modid = MOD_ID)
public class MyStaticHandler {
    @SubscribeEvent
    public static void onX(SomeEvent e) { ... }
}

// ③ 指定 Mod 总线（生命周期事件必须）
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class LifecycleHandler { ... }
```

- `@SubscribeEvent` 标记订阅器，**监听什么事件由方法参数类型决定**。
- 手动注册的实例处理器必须在主类初始化时注入总线——**忘了 register 是「写了事件但不生效」的头号原因**。
- `@Mod.EventBusSubscriber` 自动注册类下所有带注解的静态方法；`bus` 参数选择总线（默认 Forge 总线）。

## 生命周期事件（Mod 总线）

四个最常用：`FMLCommonSetupEvent`、`FMLClientSetupEvent` / `FMLDedicatedServerSetupEvent`（仅在各自物理端触发）、`InterModEnqueueEvent` / `InterModProcessEvent`。

- 这些 setup 事件**并行执行**（都是 ParallelDispatchEvent 子类）：想回主线程做事用 `enqueueWork(...)`。
- 并行意味着**不能直接调用其他模组的代码**做初始化交互——跨模组通信用 **IMC**（Enqueue 发送 / Process 接收）。
- 初始化期还有杂项事件如 `RegisterEvent`（旧版注册入口）。

## Event 基类的通用能力

所有事件继承自 `Event` 基类，常用公开能力：

- **取消**：可取消事件上调用 `setCanceled(true)`（或 `cancel()`）；监听侧检查 `isCanceled()`。能否取消取决于具体事件定义。
- **阶段**：`setPhase`/`getPhase` 控制监听器的执行次序分组。
- **结果**：`hasResult`/`setResult` 的事件可用结果值参与判定。
- **泛型事件的父子关系**：监听父事件类型会收到**所有子类**的调用（例如监听 `TickEvent` 会同时收到 Player/Client/Server/RenderTick）。只想处理某一子类就监听子类，或在方法内判型。

## 常见坑

- ❌ 实例处理器忘记 `register()` → 事件静默不生效。
- ❌ 生命周期事件挂在 Forge 总线（或反之）→ 收不到。
- ❌ 在 setup 事件里直接操作其他 mod 的注册内容且不处理并行时序 → 用 IMC 或 `enqueueWork`。
- ❌ 静态+实例混用时重复注册同一逻辑 → 触发两次。
- ❌ 监听父事件却没预期收到全部子类调用 → 高频事件（Tick 系）里做重活拖垮 TPS。
- ❌ 取消了不可取消的事件 → `setCanceled` 抛 `UnsupportedOperationException`。

## 自检

- 断点确认订阅器被调用（日志一行即可）。
- 物理端矩阵：单人 / 集成服 / 专用服，客户端专属事件不得出现在专用服路径。
- 取消类事件验证取消真的生效（如取消掉落仍不掉落）。

## 不清楚时

- 思路来源（显式 BY-NC-SA，可署名演绎）：https://www.mcmod.cn/post/2571.html
- 各版本事件名/签名：当档规则 `05-events` ＋ `search_forge_docs` / `search_neoforge_docs`（关键词 events）
- NeoForge 新版的总线与注解形态与经典 Forge 有差异——以当档官方文档为准，勿把本篇的双总线写法直接搬进新版 NeoForge 工程
