---
name: mc-sound
description: Minecraft Forge 声音开发。SoundEvent 注册、sounds.json、SoundType、播放声音。触发词：SoundEvent、SoundType、sounds.json、playSound
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 声音开发（Forge 1.12.2）

## 快速开始

### 1. 注册 SoundEvent

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModSounds {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<SoundEvent> event) {
        event.getRegistry().register(
            new SoundEvent(new ResourceLocation(MOD_ID, "my_sound"))
                .setRegistryName(MOD_ID, "my_sound")
        );
    }
}
```

### 2. sounds.json

放在 `assets/{modid}/sounds.json`：

```json
{
  "my_sound": {
    "category": "master",
    "sounds": ["examplemod:my_sound_file"]
  }
}
```

- `examplemod:my_sound_file` → `assets/examplemod/sounds/my_sound_file.ogg`

## SoundType（方块音效）

用于自定义方块被破坏/放置/踩踏时的音效：

```java
public static final SoundType MY_BLOCK_SOUNDS = new SoundType(
    1.0f, 1.0f,
    SoundEvents.BLOCK_STONE_BREAK,
    SoundEvents.BLOCK_STONE_STEP,
    SoundEvents.BLOCK_STONE_PLACE,
    SoundEvents.BLOCK_STONE_HIT,
    SoundEvents.BLOCK_STONE_FALL
);

Block.Properties.create(Material.WOOD).sound(MY_BLOCK_SOUNDS)
```

## 播放声音

### 服务端播放给附近所有玩家

```java
world.playSound(null, x, y, z,
    ModSounds.my_sound,
    SoundCategory.BLOCKS,
    1.0f, 1.0f);
```

### 服务端播放给特定玩家

```java
player.playSound(ModSounds.my_sound, 1.0f, 1.0f);
```

## SoundCategory 枚举值

| 值 | 用途 |
|----|------|
| MASTER | 主音量 |
| MUSIC | 背景音乐 |
| RECORDS | 唱片机/音符盒 |
| WEATHER | 雨/雷 |
| BLOCKS | 方块交互 |
| HOSTILE | 敌对生物 |
| NEUTRAL | 中立生物 |
| PLAYERS | 玩家动作 |
| AMBIENT | 环境音 |

## 常见错误

- ❌ `sounds.json` 中 sounds 写成对象而非数组 → 必须是 `["ns:sound"]` 格式
- ❌ 忘记在 `sounds.json` 中注册事件名

## 参考资料

- 详细示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-block` | 方块音效 |
| `mc-entity` | 生物声音 |
