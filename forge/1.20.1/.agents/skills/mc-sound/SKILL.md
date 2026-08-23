---
name: mc-sound
description: Minecraft Forge 声音开发。SoundEvent 注册、sounds.json、SoundType、播放声音。触发词：SoundEvent、SoundType、SoundSource、sounds.json、playSound
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 声音开发（Forge 1.20.1）

## 快速开始

### 1. 注册 SoundEvent

```java
private static final DeferredRegister<SoundEvent> SOUNDS =
    DeferredRegister.create(ForgeRegistries.SOUND_EVENTS, MOD_ID);

public static final RegistryObject<SoundEvent> MY_SOUND =
    SOUNDS.register("my_sound",
        () -> SoundEvent.createVariableRangeEvent(
            new ResourceLocation(MOD_ID, "my_sound")
        )
    );

// 在 mod 构造函数中
SOUNDS.register(modEventBus);
```

> 使用 `SoundEvent.createVariableRangeEvent(id)`，不要用已废弃的构造函数。

### 2. sounds.json

放在 `assets/<modid>/sounds.json`：

```json
{
  "my_sound": {
    "subtitle": "mymod.subtitle.my_sound",
    "sounds": ["mymod:my_sound_file"]
  },
  "epic_music": {
    "sounds": [
      {
        "name": "mymod:music/epic_track",
        "stream": true
      }
    ]
  }
}
```

- 每个 key 对应一个 `SoundEvent` 的注册名
- `sounds` 必须是**数组**；多个文件时随机选取
- `mymod:my_sound_file` → `assets/mymod/sounds/my_sound_file.ogg`
- `"stream": true`：长音乐（背景音/唱片）必须开启，流式播放避免内存占用
- `subtitle`：在游戏中启用字幕时显示

## SoundType（方块音效）

用于自定义方块被破坏/放置/踩踏时的音效：

```java
public static final SoundType MY_BLOCK_SOUNDS = new SoundType(
    1.0f,   // volume
    1.0f,   // pitch
    Sounds.MY_BREAK.get(),    // breakSound
    Sounds.MY_STEP.get(),     // stepSound
    Sounds.MY_PLACE.get(),    // placeSound
    Sounds.MY_HIT.get(),      // hitSound
    Sounds.MY_FALL.get()      // fallSound
);

// 使用
BlockBehaviour.Properties.of().mapColor(MapColor.STONE)
    .sound(MY_BLOCK_SOUNDS)
```

## 播放声音（服务端）

### 最常用：`Level.playSound`

```java
// 服务端调用：播放给附近所有玩家（不含 player 参数传入者）
level.playSound(
    player,                          // Player（可传 null 使所有人都听到）
    x, y, z,                         // 坐标
    ModSounds.MY_SOUND.get(),         // SoundEvent
    SoundSource.BLOCKS,               // 类别（控制音量滑条）
    1.0f,                            // volume（音量，1.0 为正常）
    1.0f                             // pitch（音高，1.0 为正常）
);
```

三个 overload 的行为：

| 方法 | 行为 |
|------|------|
| `playSound(Player, BlockPos, ...)` | 同上，坐标自动 +0.5 |
| `playSound(Player, double x, y, z, ...)` | 坐标固定，排除 player 玩家 |
| `entity.playSound(SoundEvent, vol, pitch)` | 从实体位置播放给所有人（不含实体本身） |

### 服务端播放给特定玩家

```java
// 用 Networking（见 mc-networking Skill）发自定义包到客户端触发声音
```

### 客户端播放本地声音

```java
// ClientLevel 上调用，仅本地玩家听到
clientLevel.playLocalSound(x, y, z, sound, source, vol, pitch, distanceDelay);
```

## SoundSource 枚举值

| 值 | 用途 |
|----|------|
| `MASTER` | 主音量 |
| `MUSIC` | 背景音乐 |
| `RECORDS` | 唱片机/音符盒 |
| `WEATHER` | 雨/雷 |
| `BLOCKS` | 方块交互 |
| `HOSTILE` | 敌对生物 |
| `NEUTRAL` | 中立生物 |
| `PLAYERS` | 玩家动作 |
| `AMBIENT` | 环境音 |
| `VOICE` | 语音（1.19+） |

## Decision: 选择播放方式

```
IF 服务端触发、所有附近玩家听到
  → level.playSound(player, x, y, z, sound, source, vol, pitch)

IF 服务端触发、仅特定玩家听到
  → 通过 mc-networking Skill 发自定义包，客户端收到后 playLocalSound

IF 客户端触发、仅本地玩家听到
  → clientLevel.playLocalSound(...)
```

## 常见错误

- ❌ 废弃的 `new SoundEvent(id)` 构造函数 → 使用 `SoundEvent.createVariableRangeEvent(id)`
- ❌ `sounds.json` 中 `sounds` 写成对象而非数组 → 必须是 `["ns:sound"]` 格式
- ❌ `sounds` key 使用了命名空间前缀（如 `"minecraft:stone"`）→ `sounds.json` 中的 key 本身无命名空间
- ❌ 忘记在 `sounds.json` 中注册事件名 → `SoundEvent` 存在但游戏无法解析
- ❌ 长音乐文件没有 `"stream": true` → OGG 文件全部加载到内存

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.20.1/gameeffects/sounds
- sounds.json 规范：https://minecraft.wiki/w/Sounds.json
- DataGen 生成：https://docs.minecraftforge.net/en/1.20.1/datagen/client/sounds/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 机器方块工作时播放音效 |
| `mc-networking` | 触发远程玩家的声音 |
| `mc-entity` | 生物死亡/攻击时播放音效 |

## 高级音频流（流式 / 自定义声道 / 广播）

> 本节是机制路线：vanilla（含 1.20.1 Forge 基础）**没有**开箱即用的流式音频 API、自定义声道或混音广播接口。具体类与方法签名一律以 `search_forge_docs`（`gameeffects_sounds` 页核实数据）为准，不要凭记忆补签名。

**先澄清事实**：sounds.json 的 `"stream": true` 只决定**加载方式**（流式读盘 vs 整文件进内存），它不是流式播放 API，也不提供声道/混音控制。声音最终由客户端声音引擎播放；服务端只负责「告诉客户端放什么」——广播性声音仍走 `Level#playSound`（服务端，向附近玩家同步），客户端触发的走 `Level#playLocalSound` / `ClientLevel#playLocalSound`（仅客户端）。

### 路线 1：SoundInstance 级细粒度控制（以 search_forge_docs 为准）

- 机制：向客户端声音系统提供自定义 `SoundInstance` 实例，自行掌控播放、循环、停止与衰减；它消费的仍是 sounds.json 里已注册的 sound 条目。
- 适用：持续型/可打断的环境音、循环音。
- 启动点在客户端：服务端触发需经 mc-networking 发包。

### 路线 2：外界音频库集成（以 search_forge_docs 为准）

- 机制：接入 OpenAL 之外的音频库，与客户端物理层交互，绕过游戏声音引擎。
- 适用：低延迟、自定义混音/效果链、非 .ogg 源。
- 代价：失去 SoundSource 滑条归属、字幕与衰减整合；仍需服务端发包分发触发。

### 路线 3：分块 SoundEvent 序列

- 机制：长音频按段切多个 `.ogg`，注册多个 `SoundEvent`（sounds.json 各自条目，长段用 `"stream": true`），客户端按时序依次播放。
- 适用：不引外部库的「近似流式」长音频。
- 注意：分段衔接、网络延迟下的乱序/重叠、SoundSource 类别保持一致。

### 坑清单

- ❌ 把 `"stream": true` 当流式 API → 只是加载策略，不改变播放模型
- ❌ 服务端 `for` 循环逐块 `Level#playSound` → 客户端延迟致错位；应客户端本地节奏 + 网络包触发
- ❌ 单条音乐文件巨大且未开 `"stream": true` → 整文件进内存（见上节 sounds.json）
- ❌ 自定义声道/混音找不到 API 就硬编码音量 → 先 `search_forge_docs`
- ❌ 客户端逻辑依赖「驻留的 SoundEvent 引用」判断条目可用 → 只要 sounds.json 里有条目，客户端可直接引用，不必驻留 SoundEvent（官方注）
- ✅ 能用普通 `sounds.json` + `Level#playSound` / `Level#playLocalSound` 表达的，先走常规路径，再考虑高级方案
