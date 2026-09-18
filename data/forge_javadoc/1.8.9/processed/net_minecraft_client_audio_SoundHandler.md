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
- `public SoundEventAccessorComposite getSound( ResourceLocation location)`
- `public void playSound( ISound sound)`
- `public void playDelayedSound( ISound sound, int delay)`
- `public void setListener( EntityPlayer player, float p_147691_2_)`
- `public void pauseSounds()`
- `public void stopSounds()`
- `public void unloadSounds()`
- `public void update()`
- `public void resumeSounds()`
- `public void setSoundLevel( SoundCategory category, float volume)`
- `public void stopSound( ISound p_147683_1_)`
- `public SoundEventAccessorComposite getRandomSoundFromCategories( SoundCategory ... categories)`
- `public boolean isSoundPlaying( ISound sound)`

## Description

Returns a random sound from one or more categories