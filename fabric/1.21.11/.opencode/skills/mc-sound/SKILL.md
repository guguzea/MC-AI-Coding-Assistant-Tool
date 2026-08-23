---
name: mc-sound
description: Fabric 声音系统。SoundEvent、SoundEvents、SoundCategory。触发词：声音、Sound、SoundEvent
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 声音系统（Fabric 1.21.11）

> 核实源（`data/fabric_1.21.11/fabric-docs/1.21.11/processed/`）：
> - `develop_sounds_custom.md`（id `develop-sounds-custom`）
> - `develop_sounds_using-sounds.md`（id `develop-sounds-using-sounds`）
> - `develop_sounds_dynamic-sounds.md`（id `develop-sounds-dynamic-sounds`）
> 官方 URL：https://docs.fabricmc.net/develop/sounds/custom 、https://docs.fabricmc.net/develop/sounds/using-sounds 、https://docs.fabricmc.net/develop/sounds/dynamic-sounds 。
> 本包 `mappings: yarn`；页面名 `LocalPlayer`/`SoundCategory`/`SoundEvent` 等为 Mojang/官方风格，Yarn 换算以 `search_fabric_docs version=1.21.11` 为准，禁止默写（如 `ClientPlayerEntity` 一类对名）。

## 注册自定义音效（custom 页核实）

- 音频：**OGG Vorbis** + **单声道（Mono）**（页面警告：多声道影响距离处理）。
- 放置：`resources/assets/<modid>/sounds/<name>.ogg`；`sounds.json` 位于 `resources/assets/<modid>/sounds.json`；`subtitle` 关联 `lang` 语言文件。
- 注册（页内代码块原文）：`Registry.register(BuiltInRegistries.SOUND_EVENT, Identifier.fromNamespaceAndPath(MOD_ID, "metal_whistle"), SoundEvent.createVariableRangeEvent(Identifier.fromNamespaceAndPath(MOD_ID, "metal_whistle")))`——本版 **`Identifier.fromNamespaceAndPath` + `SoundEvent.createVariableRangeEvent`** 口径（1.21.1 页为 `SoundEvent.of` 且代码块截取缺损）。
- 条目多时用 helper 类：一个方法注册全部、一个方法初始化。

## 播放（using-sounds 页核实）

- 原版全部音效实例见 `SoundEvents` 类。
- **playSound 务必在逻辑服务端调用**（页面强调）；`LivingEntity` 上只需 SoundEvent/音量/音高；**level 实例的 playSound 控力更高**（服务端播 → 跟踪范围客户端自动收网络包）。
- `SoundEvent` 决定播哪个音；**`SoundCategory`**（本版枚举名；1.21.1 页写作 `SoundSource`）决定用哪个滑条。
- **音量**：`0.0f–1.0f` 真实音量；>1 按 1.0 播、只扩可闻距离（约 `volume * 16` 格）。
- **音高**：同时改音高与时长；`0.5f–1.0f` 降低，更大升高；<0.5 按 0.5。

## 动态/交互声音（dynamic-sounds 页核实）

- 服务端播 SoundEvent 解决**广播**：跟踪范围内每个客户端（页内 `LocalPlayer`）自动收播放包。
- 循环/动态音量音高（值来自 Entity/BlockEntity）→ 自定义 **`SoundInstance`**（客户端）。
- `AbstractSoundInstance` 带 **`@Environment(EnvType.CLIENT)`**：服务端上下文使用多人服必崩；建议 split sources 工程。
- `SoundInstance` 记录音量/音高/XYZ/是否重复；页内说子类是 `AbstractTickableSoundInstance`，同时又写「extend from `MovingSoundInstance`」——页面自身措辞不一致，以 search_fabric_docs 为准。
- 引用的对象是客户端版本；与服务端不同步 → 实体 TrackedData / 方块实体 S2C 包 / 自定义 S2C 包。
- 进阶框架（页面思路）：`DynamicSoundSource`（放 common 包）、`TransitionState`（STARTING/RUNNING/ENDING）、`SoundInstanceCallback`（onFinished）、抽象基类（normalize+lerp 调制）、`DynamicSoundManager`（客户端单例）；触发经 onStartedTrackingBy / onStoppedTrackingBy 或自定义 S2C 包。

## 流式 / 自定义声道（机制路线）

> vanilla（含 1.21.11）**没有**开箱即用的流式音频 API、自定义声道或混音广播接口；具体签名一律以 `search_fabric_docs`（version=1.21.11，sounds 三页）为准。

- **事实澄清**：`"stream": true` 只决定**加载方式**（流式读盘 vs 整文件进内存），不是流式播放 API；服务端只「告诉客户端放什么」，实际播放由客户端声音引擎完成。
- **路线 1（SoundInstance 级控制）**：自定义实例自管播放/循环/停止/衰减，消费 sounds.json 条目；启动在客户端，服务端触发需 S2C 包。
- **路线 2（外部音频库）**：接入音频库与客户端物理层交互、绕过游戏声音引擎；失去滑条归属/字幕/衰减整合，仍需服务端包分发。
- **路线 3（分块 SoundEvent 序列）**：长音频切多段 `.ogg` + 多个 SoundEvent（长段开 `"stream": true`），客户端按时序播放；注意衔接、乱序/重叠、类别一致。
- **坑**：`stream:true` ≠ 流式 API；服务端逐块 for 循环 playSound → 客户端延迟错位；大文件未开 stream → 整文件进内存；找不到声道 API 硬编码音量 → 先 search_fabric_docs；服务端实例化客户端声音类 → `@Environment(CLIENT)` 崩溃。

## 决策

```
IF 一次性事件 → 服务端 playSound（自动广播跟踪范围）
IF 循环/动态调制 → 客户端自定义 SoundInstance（值同步走 TrackedData / S2C 包）
IF 流式/自定义声道/混音 → 三路线机制对照 + search_fabric_docs；未核到禁止输出签名
```

## 下一步

- `get_doc_full`（三个 sounds 页 id）/ `search_fabric_docs`（version=1.21.11）复核后输出示例；禁止抄 1.21.1 旧口径（`SoundEvent.of`/`SoundSource` 页名）或 26.1.2 专属措辞冒充本版。
