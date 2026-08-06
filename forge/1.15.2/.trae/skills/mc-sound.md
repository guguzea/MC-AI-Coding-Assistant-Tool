---
name: mc-sound
description: Minecraft Forge 声音开发。SoundEvent 注册、sounds.json、SoundType、播放声音。触发词：SoundEvent、SoundType、SoundSource、sounds.json
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 声音开发（Forge 1.15.2）

## 快速开始

### 1. 注册 SoundEvent

```java
private static final DeferredRegister<SoundEvent> SOUNDS =
    DeferredRegister.create(ForgeRegistries.SOUND_EVENTS, MOD_ID);

public static final RegistryObject<SoundEvent> MY_SOUND =
    SOUNDS.register("my_sound",
        () -> new SoundEvent(new ResourceLocation(MOD_ID, "my_sound"))
    );

// 在 mod 构造函数中
SOUNDS.register(modEventBus);
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
    () -> SoundEvents.BLOCK_STONE_BREAK,
    () -> SoundEvents.BLOCK_STONE_STEP,
    () -> SoundEvents.BLOCK_STONE_PLACE,
    () -> SoundEvents.BLOCK_STONE_HIT,
    () -> SoundEvents.BLOCK_STONE_FALL
);

// 使用
Block.Properties.create(Material.STONE)
    .sound(MY_BLOCK_SOUNDS)
```

## 播放声音（服务端）

### 最常用：`World.playSound`

```java
// 服务端调用：播放给附近所有玩家
world.playSound(null, x, y, z,
    ModSounds.MY_SOUND.get(), SoundCategory.BLOCKS, 1.0f, 1.0f);
```

三个 overload 的行为：

| 方法 | 行为 |
|------|------|
| `playSound(Entity, SoundEvent, ...)` | 从实体位置播放给所有人（不含实体本身） |
| `playSound(PlayerEntity, SoundEvent, ...)` | 排除指定玩家 |
| `playSound(PlayerEntity, BlockPos, SoundEvent, ...)` | 从方块位置播放 |

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

## Decision: 选择播放方式

```
IF 服务端触发、所有附近玩家听到
  → world.playSound(player, x, y, z, sound, source, vol, pitch)

IF 服务端触发、仅特定玩家听到
  → 通过 mc-networking Skill 发自定义包到客户端触发声音

IF 客户端触发、仅本地玩家听到
  → Minecraft.getInstance().getSoundHandler().play(...)
```

## 常见错误

- ❌ `sounds.json` 中 `sounds` 写成对象而非数组 → 必须是 `["ns:sound"]` 格式
- ❌ `sounds` key 使用了命名空间前缀 → `sounds.json` 中的 key 本身无命名空间
- ❌ 忘记在 `sounds.json` 中注册事件名 → `SoundEvent` 存在但游戏无法解析
- ❌ 长音乐文件没有 `"stream": true` → OGG 文件全部加载到内存

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.15.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 机器方块工作时播放音效 |
| `mc-entity` | 生物死亡/攻击时播放音效 |
