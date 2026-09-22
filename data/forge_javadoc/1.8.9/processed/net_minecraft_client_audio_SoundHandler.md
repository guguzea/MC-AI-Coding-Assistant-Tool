# SoundHandler

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundHandler

## Class signature

```java
public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener, ITickable
```

## Constructors

- `SoundHandler(IResourceManager manager, GameSettings gameSettingsIn)`

## Methods

- `SoundEventAccessorComposite getRandomSoundFromCategories(SoundCategory ... categories)` — Returns a random sound from one or more categories
- `SoundEventAccessorComposite getSound(ResourceLocation location)`
- `protected java.util.Map<java.lang.String, SoundList> getSoundMap(java.io.InputStream stream)`
- `boolean isSoundPlaying(ISound sound)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void pauseSounds()`
- `void playDelayedSound(ISound sound, int delay)` — Plays the sound in n ticks
- `void playSound(ISound sound)` — Play a sound
- `void resumeSounds()`
- `void setListener(EntityPlayer player, float p_147691_2_)`
- `void setSoundLevel(SoundCategory category, float volume)`
- `void stopSound(ISound p_147683_1_)`
- `void stopSounds()`
- `void unloadSounds()`
- `void update()` — Like the old updateEntity(), except more generic.

## Fields

- `static SoundPoolEntry missing_sound`