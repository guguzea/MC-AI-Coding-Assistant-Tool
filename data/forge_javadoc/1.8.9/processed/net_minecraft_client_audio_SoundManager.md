# SoundManager

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundManager

## Class signature

```java
public class SoundManager extends java.lang.Object
```

## Constructors

- `SoundManager(SoundHandler p_i45119_1_, GameSettings p_i45119_2_)`

## Methods

- `boolean isSoundPlaying(ISound sound)` — Returns true if the sound is playing or still within time
- `void pauseAllSounds()` — Pauses all currently playing sounds
- `void playDelayedSound(ISound sound, int delay)` — Adds a sound to play in n tick
- `void playSound(ISound sound)`
- `void reloadSoundSystem()`
- `void resumeAllSounds()` — Resumes playing all currently playing sounds (after pauseAllSounds)
- `void setListener(EntityPlayer player, float p_148615_2_)` — Sets the listener of sounds
- `void setSoundCategoryVolume(SoundCategory category, float volume)` — Adjusts volume for currently playing sounds in this category
- `void stopAllSounds()` — Stops all currently playing sounds
- `void stopSound(ISound sound)`
- `void unloadSoundSystem()` — Cleans up the Sound System
- `void updateAllSounds()`

## Fields

- `SoundHandler sndHandler` — A reference to the sound handler.