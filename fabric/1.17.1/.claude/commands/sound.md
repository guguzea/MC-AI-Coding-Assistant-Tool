# Fabric 声音系统命令参考

本文件描述 Fabric 1.17.1 平台上进行声音（Sound）系统开发时所需掌握的核心 API 和常用命令。

## 核心概念

声音系统包括声音事件（Sound Event）和声音文件。声音事件是注册的对象，声音文件是实际的音频资源（OGG 格式）。

## 声音事件注册命令

### SoundEvent 创建命令

```java
// ✅ 1.17.x 使用 Registry.SOUND_EVENT
private static final SoundEvent MY_SOUND = Registry.register(
    Registry.SOUND_EVENT,
    new Identifier(MOD_ID, "my_sound"),
    new SoundEvent(new Identifier(MOD_ID, "my_sound"))
);
```

声音文件放在 `assets/{modid}/sounds/` 目录，对应 `examplemod:my_sound` 事件的文件路径为 `sounds/my_sound.ogg`。

## 声音播放命令

```java
// 在世界中播放声音
world.playSound(player, MY_SOUND, SoundCategory.MASTER, 1.0f, 1.0f);

// 向特定玩家播放
player.playSound(MY_SOUND, SoundCategory.PLAYERS, 1.0f, 1.0f);
```

## 注意事项

1.17.1 的声音 API 与 1.20.x 差异较小。`SoundCategory` 在 1.17.x 中存在，但具体枚举值可能略有不同。建议参考原版源码。
