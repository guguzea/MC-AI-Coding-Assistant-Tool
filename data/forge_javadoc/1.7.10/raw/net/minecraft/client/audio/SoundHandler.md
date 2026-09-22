---
title: "SoundHandler"
description: "public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener, IUpdatePlayerListBox"
package: "net/minecraft/client/audio"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/audio/SoundHandler.html"
sourceType: javadoc
---

# SoundHandler

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundHandler

## Class signature

```java
public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener, IUpdatePlayerListBox
```

## Constructors

- `SoundHandler(IResourceManager p_i45122_1_, GameSettings p_i45122_2_)`

## Methods

- `SoundEventAccessorComposite getRandomSoundFromCategories(SoundCategory ... p_147686_1_)`
- `SoundEventAccessorComposite getSound(ResourceLocation p_147680_1_)`
- `boolean isSoundPlaying(ISound p_147692_1_)`
- `void onResourceManagerReload(IResourceManager p_110549_1_)`
- `void pauseSounds()`
- `void playDelayedSound(ISound p_147681_1_, int p_147681_2_)`
- `void playSound(ISound p_147682_1_)`
- `void resumeSounds()`
- `void setListener(EntityPlayer p_147691_1_, float p_147691_2_)`
- `void setSoundLevel(SoundCategory p_147684_1_, float p_147684_2_)`
- `void stopSound(ISound p_147683_1_)`
- `void stopSounds()`
- `void unloadSounds()`
- `void update()`

## Fields

- `static SoundPoolEntry missing_sound`
