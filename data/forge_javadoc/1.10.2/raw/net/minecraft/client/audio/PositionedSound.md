---
title: "PositionedSound"
description: "public abstract class PositionedSound extends java.lang.Object implements ISound"
package: "net/minecraft/client/audio"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/audio/PositionedSound.html"
sourceType: javadoc
---

# PositionedSound

**Inheritance:** java.lang.Object → net.minecraft.client.audio.PositionedSound

## Class signature

```java
public abstract class PositionedSound extends java.lang.Object implements ISound
```

## Constructors

- `PositionedSound(ResourceLocation soundId, SoundCategory categoryIn)`
- `PositionedSound(SoundEvent soundIn, SoundCategory categoryIn)`

## Methods

- `boolean canRepeat()`
- `SoundEventAccessor createAccessor(SoundHandler handler)`
- `ISound.AttenuationType getAttenuationType()`
- `SoundCategory getCategory()`
- `float getPitch()`
- `int getRepeatDelay()`
- `Sound getSound()`
- `ResourceLocation getSoundLocation()`
- `float getVolume()`
- `float getXPosF()`
- `float getYPosF()`
- `float getZPosF()`

## Fields

- `protected ISound.AttenuationType attenuationType`
- `protected SoundCategory category`
- `protected float pitch`
- `protected ResourceLocation positionedSoundLocation`
- `protected boolean repeat`
- `protected int repeatDelay`
- `protected Sound sound`
- `protected float volume`
- `protected float xPosF`
- `protected float yPosF`
- `protected float zPosF`
