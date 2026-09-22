---
title: "SoundEventAccessorComposite"
description: "public class SoundEventAccessorComposite extends java.lang.Object implements ISoundEventAccessor<SoundPoolEntry>"
package: "net/minecraft/client/audio"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/audio/SoundEventAccessorComposite.html"
sourceType: javadoc
---

# SoundEventAccessorComposite

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundEventAccessorComposite

## Class signature

```java
public class SoundEventAccessorComposite extends java.lang.Object implements ISoundEventAccessor<SoundPoolEntry>
```

## Constructors

- `SoundEventAccessorComposite(ResourceLocation soundLocation, double pitch, double volume, SoundCategory category)`

## Methods

- `void addSoundToEventPool(ISoundEventAccessor<SoundPoolEntry> sound)`
- `SoundPoolEntry cloneEntry()`
- `SoundCategory getSoundCategory()`
- `ResourceLocation getSoundEventLocation()`
- `int getWeight()`
