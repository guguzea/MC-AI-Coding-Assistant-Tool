---
title: "ISound"
description: "public interface ISound"
package: "net/minecraft/client/audio"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/audio/ISound.html"
sourceType: javadoc
---

# ISound

## Class signature

```java
public interface ISound
```

## Methods

- `ResourceLocation getSoundLocation()`
- `@Nullable SoundEventAccessor createAccessor( SoundHandler handler)`
- `Sound getSound()`
- `SoundCategory getCategory()`
- `boolean canRepeat()`
- `int getRepeatDelay()`
- `float getVolume()`
- `float getPitch()`
- `float getXPosF()`
- `float getYPosF()`
- `float getZPosF()`
- `ISound.AttenuationType getAttenuationType()`
