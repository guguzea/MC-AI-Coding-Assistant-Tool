---
name: mc-sound
description: Minecraft Forge 声音开发。SoundEvent 注册、sounds.json、SoundType、播放声音。触发词：SoundEvent、SoundType、SoundCategory、sounds.json、playSound
platform: forge
version: "1.14.4"
---

# 声音开发（Forge 1.14.4）

## 快速开始

### 1. 注册 SoundEvent

```java
public static final SoundEvent MY_SOUND = new SoundEvent(
    new ResourceLocation(MOD_ID, "my_sound")
);

@SubscribeEvent
public static void onSoundRegistry(final RegistryEvent.Register<SoundEvent> event) {
    event.getRegistry().register(MY_SOUND.setRegistryName(new ResourceLocation(MOD_ID, "my_sound")));
}
```

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
- `sounds` 必须是**数组**
- `mymod:my_sound_file` → `assets/mymod/sounds/my_sound_file.ogg`
- `"stream": true`：长音乐必须开启，流式播放

## SoundType（方块音效）

用于自定义方块被破坏/放置/踩踏时的音效：

```java
public static final SoundType MY_BLOCK_SOUNDS = new SoundType(
    1.0f,   // volume
    1.0f,   // pitch
    SoundEvents.BLOCK_STONE_BREAK,    // breakSound
    SoundEvents.BLOCK_STONE_STEP,     // stepSound
    SoundEvents.BLOCK_STONE_PLACE,    // placeSound
    SoundEvents.BLOCK_STONE_HIT,     // hitSound
    SoundEvents.BLOCK_STONE_FALL      // fallSound
);

// 使用
new Block(Block.Properties.create(Material.STONE).sound(MY_BLOCK_SOUNDS)
```

## 播放声音（服务端）

### 最常用：`World.playSound`

```java
// 服务端调用：播放给附近所有玩家（不含 player 参数传入者）
world.playSound(
    player,                          // PlayerEntity（可传 null）
    x, y, z,                         // 坐标
    ModSounds.MY_SOUND.get(),          // SoundEvent
    SoundCategory.BLOCKS,            // 类别（控制音量滑条）
    1.0f,                            // volume（音量）
    1.0f                             // pitch（音高）
);
```

## SoundCategory 枚举值

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
| `VOICE` | 语音 |

## Decision: 选择播放方式

```
IF 服务端触发、所有附近玩家听到
  → world.playSound(player, x, y, z, sound, category, vol, pitch)

IF 服务端触发、仅特定玩家听到
  → 通过 mc-networking Skill 发自定义包到客户端触发声音

IF 客户端触发、仅本地玩家听到
  → world.playSound(player, x, y, z, sound, category, vol, pitch)（客户端 World）
```

## 常见错误

- ❌ `SoundCategory` vs `SoundCategory`：注意正确的枚举名
- ❌ `sounds.json` 中 `sounds` 写成对象而非数组 → 必须是 `["ns:sound"]` 格式
- ❌ 忘记在 `sounds.json` 中注册事件名 → `SoundEvent` 存在但游戏无法解析
- ❌ 长音乐文件没有 `"stream": true` → OGG 文件全部加载到内存

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.14.4/gameeffects/sounds

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 机器方块工作时播放音效 |
| `mc-networking` | 触发远程玩家的声音 |
| `mc-entity` | 生物死亡/攻击时播放音效 |
