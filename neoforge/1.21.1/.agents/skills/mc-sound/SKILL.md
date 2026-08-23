---
name: mc-sound
description: NeoForge 1.21.1 mc-sound。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-sound（NeoForge 1.21.1）

> 本档为**主档 neoforge 根下的子档**；差异以本档 `search_neoforge_docs`（platform=neoforge, version=1.21.1）为准。**1.21.1 树（data/neoforge_1.21.1）没有 sound 独立文档页**：以下为机制路线 + Forge 1.20.1 语义基线（页 id `gameeffects_sounds`），NeoForge 侧类名/注册表名/事件名一律**先复核**，核不到不输出签名。禁止从扁平 neoforge/.agents/skills 或邻档复制旧 API。

## 入口（语义基线，主档 neoforge 根同题 skill 为完整稿；NeoForge 1.21.1 以复核为准）

1. **注册 SoundEvent**：`DeferredRegister.create(NeoForgeRegistries.SOUND_EVENTS, MOD_ID)` + `SoundEvent.createVariableRangeEvent(...)`（不要用已废弃构造），`register(modEventBus)` 挂 mod event bus。
2. **sounds.json**：`assets/<modid>/sounds.json`，每个 key 对应一个注册名；`sounds` 必须是数组（多文件随机取）；`"stream": true` 长音频流式读盘；`subtitle` 字幕文案。
3. **SoundType**：方块破坏/放置/踩踏/脚步/落地音效，方块属性 `.sound(...)` 挂接。
4. **播放**：服务端广播走 `Level#playSound`（附近玩家、排除指定玩家/可传 null 让所有人听）；客户端本地播放入口名以 `search_neoforge_docs` 复核。
5. **SoundSource 枚举**：`MASTER` / `MUSIC` / `RECORDS` / `WEATHER` / `BLOCKS` / `HOSTILE` / `NEUTRAL` / `PLAYERS` / `AMBIENT` / `VOICE`——控制音量滑条归属。

## 本档差异与边界

- Java 21、`ResourceLocation`、mojmap；资源 id 用 `ResourceLocation.fromNamespaceAndPath`。
- 服务端触发「特定玩家」的声音：经本档 `mc-networking`（1.21.1 payload 形态，`RegisterPayloadHandlersEvent` 复数）发包，客户端本地播放——不要 SimpleChannel。
- 主档同题 skill 的播放方式决策表、错误清单与「流式/自定义声道/广播」机制路线为基线；1.21.1 具体签名异动以 `search_neoforge_docs` 复核。

## 高级音频流（流式 / 自定义声道 / 广播）——机制路线，未核实签名

> vanilla（含 NeoForge 基础）**没有**开箱即用的流式音频 API、自定义声道或混音广播接口。具体类与方法签名一律以 `search_neoforge_docs` 为准，不要凭记忆补签名。

- **事实澄清**：`"stream": true` 只决定**加载方式**（流式读盘 vs 整文件进内存），不是流式播放 API，也不提供声道/混音控制；声音由客户端声音引擎播放，服务端只负责「告诉客户端放什么」——广播仍走 `Level#playSound`（主档已核实），客户端本地触发走客户端本地播放入口（Forge 1.20.1 语义对应 `Level#playLocalSound` / `ClientLevel`，NeoForge 侧以复核为准）。
- **路线 1（SoundInstance 级细粒度控制）**：自定义 `SoundInstance` 实例，自行掌控播放/循环/停止/衰减；消费 sounds.json 已注册条目；启动点在客户端，服务端触发需经 `mc-networking` 发包。
- **路线 2（外界音频库集成）**：接入 OpenAL 之外的音频库，与客户端物理层交互，绕过游戏声音引擎；适合低延迟、自定义混音/效果链、非 .ogg 源；代价是失去 SoundSource 滑条归属、字幕与衰减整合，仍需服务端发包分发。
- **路线 3（分块 SoundEvent 序列）**：长音频按段切多个 `.ogg`、注册多个 `SoundEvent`，客户端按时序依次播放；注意分段衔接、网络延迟下的乱序/重叠、SoundSource 类别一致。
- **坑清单**：❌ 把 `"stream": true` 当流式 API（只是加载策略）；❌ 服务端 for 循环逐块 `Level#playSound`（客户端延迟致错位）；❌ 长音乐未开 `"stream": true` 整文件进内存；❌ 找不到声道/混音 API 就硬编码音量；❌ 依赖「驻留的 SoundEvent 引用」判断条目可用（sounds.json 有条目即可引用，Forge 官方注，NeoForge 复核）；✅ 能用常规 `sounds.json` + 服务端/客户端播放入口表达的，先走常规路径。

## 官网链接

- 文档根：https://docs.neoforged.net/docs/1.21.1/ ；检索：`search_neoforge_docs`（platform=neoforge, version=1.21.1）。
- Forge 语义基线页：https://docs.minecraftforge.net/en/1.20.1/gameeffects/sounds
