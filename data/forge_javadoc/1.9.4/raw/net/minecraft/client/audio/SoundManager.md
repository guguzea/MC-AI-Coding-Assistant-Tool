---
title: "SoundManager"
description: "public class SoundManager extends java.lang.Object"
package: "net/minecraft/client/audio"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/audio/SoundManager.html"
sourceType: javadoc
---

# SoundManager

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundManager

## Class signature

```java
public class SoundManager extends java.lang.Object
```

## Constructors

- `SoundManager(SoundHandler p_i45119_1_, GameSettings p_i45119_2_)`

## Methods

- `void addListener(ISoundEventListener listener)`
- `boolean isSoundPlaying(ISound sound)`
- `void pauseAllSounds()`
- `void playDelayedSound(ISound sound, int delay)`
- `void playSound(ISound p_sound)`
- `void reloadSoundSystem()`
- `void removeListener(ISoundEventListener listener)`
- `void resumeAllSounds()`
- `void setListener(EntityPlayer player, float p_148615_2_)`
- `void setVolume(SoundCategory category, float volume)`
- `void stop(java.lang.String p_189567_1_, SoundCategory p_189567_2_)`
- `void stopAllSounds()`
- `void stopSound(ISound sound)`
- `void unloadSoundSystem()`
- `void updateAllSounds()`

## Fields

- `SoundHandler sndHandler`
