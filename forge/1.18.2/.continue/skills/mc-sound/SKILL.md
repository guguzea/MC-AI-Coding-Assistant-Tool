---
name: mc-sound
description: Minecraft Forge 声音开发。
platform: forge
version: "1.18.2"
---

# 声音开发（Forge 1.18.2）

## 注册 SoundEvent

```java
public static final DeferredRegister<SoundEvent> SOUNDS =
    DeferredRegister.create(ForgeRegistries.SOUNDEVENTS, MOD_ID);
```

## 参考资料

参见 `02-block.mdc`
