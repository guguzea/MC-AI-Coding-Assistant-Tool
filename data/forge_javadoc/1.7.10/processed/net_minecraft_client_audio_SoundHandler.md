# SoundHandler

## Class signature

```java
public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener , IUpdatePlayerListBox
```

## Constructors

- `public SoundHandler( IResourceManager p_i45122_1_, GameSettings p_i45122_2_)`

## Methods

- `public void onResourceManagerReload( IResourceManager p_110549_1_)`
- `public SoundEventAccessorComposite getSound( ResourceLocation p_147680_1_)`
- `public void playSound( ISound p_147682_1_)`
- `public void playDelayedSound( ISound p_147681_1_, int p_147681_2_)`
- `public void setListener( EntityPlayer p_147691_1_, float p_147691_2_)`
- `public void pauseSounds()`
- `public void stopSounds()`
- `public void unloadSounds()`
- `public void update()`
- `public void resumeSounds()`
- `public void setSoundLevel( SoundCategory p_147684_1_, float p_147684_2_)`
- `public void stopSound( ISound p_147683_1_)`
- `public SoundEventAccessorComposite getRandomSoundFromCategories( SoundCategory ... p_147686_1_)`
- `public boolean isSoundPlaying( ISound p_147692_1_)`