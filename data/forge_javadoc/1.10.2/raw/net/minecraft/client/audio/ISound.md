---
title: "ISound"
description: "public interface ISound"
package: "net/minecraft/client/audio"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/audio/ISound.html"
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
