---
name: sound
description: Minecraft Forge 声音开发（Forge 1.13.2）。SoundEvent 注册、sounds.json、播放声音。触发词：SoundEvent、sounds.json
---

# 声音开发（Forge 1.13.2）

## 快速开始

```java
public static final SoundEvent MY_SOUND = new SoundEvent(
    new ResourceLocation(MOD_ID, "my_sound")
);

@SubscribeEvent
public void onSoundsRegistry(RegistryEvent.Register<SoundEvent> event) {
    event.getRegistry().register(MY_SOUND.setRegistryName(...));
}
```

## sounds.json

```json
{
  "my_sound": {
    "category": "master",
    "sounds": ["modid:my_sound_file"]
  }
}
```

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
