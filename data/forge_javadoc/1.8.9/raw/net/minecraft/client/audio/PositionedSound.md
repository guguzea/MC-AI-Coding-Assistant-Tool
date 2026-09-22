---
title: "PositionedSound"
description: "public abstract class PositionedSound extends java.lang.Object implements ISound"
package: "net/minecraft/client/audio"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/audio/PositionedSound.html"
sourceType: javadoc
---

# PositionedSound

**Inheritance:** java.lang.Object → net.minecraft.client.audio.PositionedSound

## Class signature

```java
public abstract class PositionedSound extends java.lang.Object implements ISound
```

## Constructors

- `PositionedSound(ResourceLocation soundResource)`

## Methods

- `boolean canRepeat()`
- `ISound.AttenuationType getAttenuationType()`
- `float getPitch()`
- `int getRepeatDelay()`
- `ResourceLocation getSoundLocation()`
- `float getVolume()`
- `float getXPosF()`
- `float getYPosF()`
- `float getZPosF()`

## Fields

- `protected ISound.AttenuationType attenuationType`
- `protected float pitch`
- `protected ResourceLocation positionedSoundLocation`
- `protected boolean repeat`
- `protected int repeatDelay` — The number of ticks between repeating the sound
- `protected float volume`
- `protected float xPosF`
- `protected float yPosF`
- `protected float zPosF`
