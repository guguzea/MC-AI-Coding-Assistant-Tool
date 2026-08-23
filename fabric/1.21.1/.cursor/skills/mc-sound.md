---
name: mc-sound
description: Fabric 声音系统。SoundEvent、SoundEvents、SoundCategory。触发词：声音、Sound、SoundEvent
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# 声音系统（Fabric 1.21.1）

> 核实源（`data/fabric_1.21.1/fabric-docs/1.21.1/processed/`）：
> - `develop_sounds_using-sounds.md`（id `develop-sounds-using-sounds`）
> - `develop_sounds_custom.md`（id `develop-sounds-custom`）
> - `develop_sounds_dynamic-sounds.md`（id `develop-sounds-dynamic-sounds`）
> 官方 URL：https://docs.fabricmc.net/develop/sounds/using-sounds 、https://docs.fabricmc.net/develop/sounds/custom 、https://docs.fabricmc.net/develop/sounds/dynamic-sounds 。
> 以下名称全部按页面原文引用；与 Yarn 名不一致处以本档 `search_fabric_docs version=1.21.1` 为准，禁止默写。

## 快速开始

```java
// 1. 创建 SoundEvent
private static final SoundEvent MY_SOUND = Registry.register(
    Registries.SOUND_EVENT,
    Identifier.of(MOD_ID, "my_sound"),
    SoundEvent.of(Identifier.of(MOD_ID, "my_sound"))
);

// 2. 播放声音
player.playSound(MY_SOUND, 1.0f, 1.0f);
```

> 注：1.21.1 页内「Registering the Custom Sound」代码块截取有缺损（`BuiltInRegistries.SOUND_EVENT`/`ResourceLocation.fromNamespaceAndPath` 与 `SoundEvent.of` 混杂），上述 Yarn 写法沿用本技能原有骨架，正式使用前用 `search_fabric_docs`（sound 相关页）比对一次注册常量与工厂名。

## Decision: 选择声音用途

```
IF 在世界中播放声音
  → World.playSound()（逻辑服务端执行，页面强调：使用声音务必在逻辑服务端调用 playSound）
IF 在 GUI 中播放声音
  → ClientPlayerEntity.playSound()
IF 循环播放 / 动态音量音高
  → 使用 SoundInstance（客户端）
```

## 准备音频（custom 页）

- 文件格式：**OGG Vorbis**；**单声道（Mono）**——多声道会与 Minecraft 的距离衰减处理冲突。
- 放置：`resources/assets/<modid>/sounds/<name>.ogg`；`sounds.json` 在 `resources/assets/<modid>/sounds.json`。
- `subtitle` 条目给玩家更多语境；字幕名写进语言文件（`resources/assets/<modid>/lang`），开启字幕时显示。
- 注册：在 mod initializer 中注册 `SoundEvent`（代码见快速开始）。
- 条目多了后建议建 helper 类：一个注册所有声音、一个初始化方法；initializer 里一行搞定。

## 播放（using-sounds 页）

- 想看全部原版音效实例 → `SoundEvents` 类。
- `playSound()` 用在 `LivingEntity` 上：只需 SoundEvent、音量、音高；**world 实例上也有 playSound，控制力更高**。
- `SoundEvent` 决定放哪个音；`SoundSource`（页面枚举名）决定用哪个设置滑条调音量。
- **音量**：`0.0f–1.0f` 内真实改变音量；超过 1 时按 1.0 播放，只扩大可闻距离，距离约 `volume * 16` 格。
- **音高**：同时改变音高与时长；`0.5f–1.0f` 内两者下降，更大则上升；低于 `0.5f` 按 0.5 处理。

## 动态/交互声音（dynamic-sounds 页）

- 为什么用逻辑服务端播 `SoundEvent`：服务端自动**广播**——跟踪范围内每个客户端（页内 `ClientPlayerEntity`）都会收到一个播放该声音的网络包，一次播放、指定音量音高，无需自己发包。
- 需要**循环、动态调节音量/音高**（值来自 Entity/BlockEntity）时，简单 SoundEvent 不够 → 自定义 **`SoundInstance`**。
- `SoundInstance` 仍消费 `SoundEvent`；只在执行它的那个客户端播放；UI 点击音可先用现成 `PositionedSoundInstance`。
- ⚠ `AbstractSoundInstance`（SoundInstance 父类）带 **`@Environment(EnvType.CLIENT)`**：服务端上下文使用会崩（多人服最明显）；建议用官方模板生成器「Split client and common sources」工程。
- `AbstractSoundInstance` 记录：音量、音高、**XYZ 坐标**、播完是否重复；子类 `MovingSoundInstance` 加 **`TickableSoundInstance`** 接口获得 tick 功能。
- 自定义方式：继承 `MovingSoundInstance`，重写 `tick()`；`SoundInstance` 里引用的对象是**客户端版本**，与服务端属性可能不同——用实体的 `TrackedData`、方块实体 S2C 包或自定义 S2C 包同步。
- 播放/停止：经客户端 sound manager；可手动停止。
- 进阶框架（页面给出全套自建思路）：`DynamicSoundSource` 接口（抽象数据源，放 common 包）、`TransitionState` 枚举（STARTING / RUNNING / ENDING，淡入/淡出）、`SoundInstanceCallback`（回调，如 `onFinished`）、抽象基类（用 normalize + lerp 做音高/音量调制）、`DynamicSoundManager`（客户端单例，集中播放/停止/登记）；触发源可用实体的 onStartedTrackingBy / onStoppedTrackingBy 或自定义 S2C 包。

## 流式 / 自定义声道（机制路线）

> 本节是机制路线：vanilla（含 1.21.1 Fabric 基础）**没有**开箱即用的流式音频 API、自定义声道或混音广播接口。具体类与方法签名一律以 `search_fabric_docs`（sounds 三页核实数据）为准，不要凭记忆补签名。

**先澄清事实**：sounds.json 的 `"stream": true` 只决定**加载方式**（流式读盘 vs 整文件进内存），它不是流式播放 API，也不提供声道/混音控制。声音最终由客户端声音引擎播放；服务端只负责「告诉客户端放什么」——广播音走服务端 playSound（跟踪范围内客户端收包），仅本地播放的走客户端侧播放（页面所述 SoundInstance 体系）。

### 路线 1：SoundInstance 级细粒度控制（以 search_fabric_docs 为准）

- 机制：向客户端声音系统提供自定义 `SoundInstance`，自行掌控播放、循环、停止与衰减；消费的仍是 sounds.json 里的条目。
- 适用：持续型/可打断的环境音、循环音。
- 启动点在客户端；服务端触发需自定义 S2C 包（dynamic-sounds 页思路）。

### 路线 2：外界音频库集成（以 search_fabric_docs 为准）

- 机制：接入 OpenAL 之外的音频库，与客户端物理层交互，绕过游戏声音引擎。
- 适用：低延迟、自定义混音/效果链、非 .ogg 源。
- 代价：失去 SoundCategory/SoundSource 滑条归属、字幕与衰减整合；仍需服务端发包分发触发。

### 路线 3：分块 SoundEvent 序列

- 机制：长音频按段切多个 `.ogg`，注册多个 `SoundEvent`（sounds.json 各自条目，长段用 `"stream": true`），客户端按时序播放。
- 适用：不引外部库的「近似流式」长音频。
- 注意：分段衔接、网络延迟下的乱序/重叠、滑条类别保持一致。

### 坑清单

- ❌ 把 `"stream": true` 当流式 API → 只是加载策略，不改变播放模型
- ❌ 服务端 `for` 循环逐块 playSound → 客户端延迟致错位；应客户端本地节奏 + 网络包触发
- ❌ 单条音乐巨大且未开 `"stream": true` → 整文件进内存
- ❌ 自定义声道/混音找不到 API 就硬编码音量 → 先 `search_fabric_docs`
- ❌ 服务端上下文实例化 `SoundInstance`/客户端声音类 → `@Environment(CLIENT)`，多人服必崩（页面明示）
- ✅ 能用 sounds.json + 服务端 playSound / SoundInstance 表达的，先走常规路径，再考虑高级方案

## 常见错误

- ❌ 忘记在 resources 中添加声音文件 — 声音文件不存在
- ❌ 非 Mono 音频 → 距离衰减异常
- ❌ 逻辑客户端调用服务端播放 → 广播失效/装包

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 声音事件通过 Registry.register() 注册 |
| `mc-item` | 物品可以播放声音 |
| `mc-entity` | 实体可以播放声音 |
| `mc-networking` | 服务端触发客户端 SoundInstance 需要自定义 S2C 包 |
