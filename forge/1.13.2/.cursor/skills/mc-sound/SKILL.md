---
name: mc-sound
description: Minecraft Forge 声音开发。SoundEvent 注册、sounds.json、SoundType、播放声音。触发词：SoundEvent、SoundType、SoundSource、sounds.json、playSound
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 声音开发（Forge 1.13.2）

## 快速开始

### 1. 注册 SoundEvent

```java
public static final SoundEvent MY_SOUND = new SoundEvent(
    new ResourceLocation(MOD_ID, "my_sound")
);

@SubscribeEvent
public void onSoundsRegistry(RegistryEvent.Register<SoundEvent> event) {
    event.getRegistry().register(MY_SOUND.setRegistryName(
        new ResourceLocation(MOD_ID, "my_sound")
    ));
}
```

### 2. sounds.json

放在 `assets/<modid>/sounds.json`：

```json
{
  "my_sound": {
    "category": "master",
    "sounds": ["modid:my_sound_file"]
  }
}
```

## 播放声音

```java
// 在世界中播放
world.playSound(player, pos, MY_SOUND, SoundCategory.BLOCKS, 1.0f, 1.0f);
```

## 常见错误

- ❌ sounds.json 中 sounds 写成对象而非数组
- ❌ 忘记在 sounds.json 中注册事件名

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
