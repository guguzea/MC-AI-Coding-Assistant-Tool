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
BlockBehaviour.Properties.of(Material.STONE)
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
