---
title: "SoundHandler"
description: "public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener , ITickable"
package: "net/minecraft/client/audio"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/audio/SoundHandler.html"
sourceType: javadoc
---

# SoundHandler

## Class signature

```java
public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener , ITickable
```

## Constructors

- `public SoundHandler( IResourceManager manager, GameSettings gameSettingsIn)`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `protected java.util.Map<java.lang.String, SoundList > getSoundMap(java.io.InputStream stream)`
- `public SoundEventAccessor getAccessor( ResourceLocation location)`
- `public void playSound( ISound sound)`
- `public void playDelayedSound( ISound sound, int delay)`
- `public void setListener( EntityPlayer player, float p_147691_2_)`
- `public void setListener( Entity entity, float partialTicks)`
- `public void pauseSounds()`
- `public void stopSounds()`
- `public void unloadSounds()`
- `public void update()`
- `public void resumeSounds()`
- `public void setSoundLevel( SoundCategory category, float volume)`
- `public void stopSound( ISound soundIn)`
- `public boolean isSoundPlaying( ISound sound)`
- `public void addListener( ISoundEventListener listener)`
- `public void removeListener( ISoundEventListener listener)`
- `public void stop(java.lang.String p_189520_1_, SoundCategory p_189520_2_)`
