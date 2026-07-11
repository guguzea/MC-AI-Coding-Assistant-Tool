---
name: mc-sound
description: Minecraft Forge 声音开发。SoundEvent 注册、sounds.json。触发词：SoundEvent、SoundType、sounds.json
platform: forge
version: "1.18.2"
---

# 声音开发（Forge 1.18.2）

## 注册 SoundEvent

```java
public static final DeferredRegister<SoundEvent> SOUNDS =
    DeferredRegister.create(ForgeRegistries.SOUNDEVENTS, MOD_ID);

public static final RegistryObject<SoundEvent> MY_SOUND =
    SOUNDS.register("my_sound",
        () -> SoundEvent.createVariableRangeEvent(new ResourceLocation(MOD_ID, "my_sound")));
```

## 参考资料

参见 `02-block.mdc`
