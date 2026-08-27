---
name: mc-sound
description: Fabric 声音系统。SoundEvent、SoundEvents、SoundCategory。触发词：声音、Sound、SoundEvent
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# 声音系统（Fabric 1.20.1）

> **核实结论**：本版（1.20.1）**没有 fabric-docs 版本树**（`data/fabric_1.20.1/meta.json`：`pages: []`；failures.json：无 versions/1.20.1 与可用归档，不要用 main/VitePress 当本档官方树）。本档 wiki 亦无声音页。
> **策略**：既有 Yarn 1.20.1 代码为本技能骨架/包内规则既有写法，**未在本版文档树核实**；以下机制路线来自 1.21.1 档 sounds 三页（同世代体系对照，非本版签名）。

## 快速开始（骨架既有，Yarn 1.20.1 口径）

```java
// 1. 创建 SoundEvent
private static final SoundEvent MY_SOUND = Registry.register(
    Registries.SOUND_EVENT,
    new Identifier(MOD_ID, "my_sound"),      // 1.20.1 Yarn：构造器写法
    SoundEvent.of(new Identifier(MOD_ID, "my_sound"))
);

// 2. 播放声音
player.playSound(MY_SOUND, 1.0f, 1.0f);
```

> 注：Yarn 1.20.1 为 `new Identifier(...)`（`Identifier.of` 是 1.20.2+ 变化，以 `query_api` / 包内规则核实为准）。

## Decision: 选择声音用途

```
IF 在世界中播放声音
  → World.playSound()（逻辑服务端执行——1.21.1 页强调：使用声音务必在逻辑服务端调用 playSound）
IF 在 GUI 中播放声音
  → ClientPlayerEntity.playSound()
IF 循环播放
  → 使用 SoundInstance（客户端）
```

## 机制对照（1.21.1 sounds 三页，非本版核实）

- **文件**：OGG Vorbis + **单声道（Mono）**；`resources/assets/<modid>/sounds/<name>.ogg`；`sounds.json` 在 `resources/assets/<modid>/sounds.json`；`subtitle` 关联 `lang` 语言文件。
- **播放**：服务端 playSound 自动**广播**（跟踪范围内客户端收播放包）；`SoundEvent` 决定哪个音、类别枚举（1.21.1 页 `SoundSource`，1.20.1 世代 Yarn 为 `SoundCategory`——语言文件实际用了哪个以核实为准）决定滑条。
- **音量**：0.0–1.0 真实音量；>1 按 1.0 播、只扩可闻距离（约 volume × 16 格）。**音高**：0.5–1.0 降，更大升，<0.5 按 0.5。
- **动态音**：自定义 `SoundInstance`（客户端）；基类带 `@Environment(EnvType.CLIENT)`，服务端用崩；记录音量/音高/XYZ/重复；tick 能力；对象值同步走 TrackedData / S2C 包。进阶框架（页面思路）：`DynamicSoundSource` / `TransitionState`（STARTING/RUNNING/ENDING）/ 回调 / 客户端单例管理类。
- **名称风险**：页名为 Mojang 风格；1.20.1 Yarn 对应名（`SoundCategory`、`ClientPlayerEntity`、`AbstractSoundInstance` 等）以 `query_api` / `search_community_docs` 复核，禁止默写。

## 流式 / 自定义声道（机制路线）

> vanilla（含 1.20.1）**没有**开箱即用的流式音频 API、自定义声道或混音广播接口；具体签名以核实为准，不要凭记忆补。

- **事实澄清**：sounds.json 的 `"stream": true` 只决定加载方式（流式读盘 vs 整文件进内存），不是流式播放 API。
- **路线 1**：自定义 `SoundInstance` 级控制（播放/循环/停止/衰减），消费 sounds.json 条目；启动在客户端，服务端触发需网络包。
- **路线 2**：外部音频库，绕过游戏声音引擎；失去滑条归属/字幕/衰减整合，仍需服务端包分发。
- **路线 3**：分块 SoundEvent 序列（长音频切多个 .ogg + 多个事件，长段开 `"stream": true`）；注意衔接、乱序/重叠、类别一致。
- **坑**：`stream:true` ≠ 流式 API；服务端 for 循环逐块播放 → 延迟错位；大文件未开 stream → 整文件进内存；服务端实例化客户端声音类 → `@Environment(CLIENT)` 崩溃。

## 查证路径

1. `query_api`（1.20.1 在覆盖范围）：核 `SoundEvent` / `SoundEvents` / `SoundCategory` / `SoundInstance` 相关类；
2. `search_docs` / `search_fabric_docs`（1.20.1）→ 预期 DOC_NOT_FOUND；
3. `search_community_docs`（社区实务）。

## 常见错误

- ❌ 忘记在 resources 中添加声音文件 — 声音文件不存在
- ❌ 非 Mono 音频 → 距离衰减异常

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 声音事件通过 Registry.register() 注册 |
| `mc-item` | 物品可以播放声音 |
| `mc-entity` | 实体可以播放声音 |
| `mc-networking` | 服务端触发客户端 SoundInstance 需要自定义网络包 |
