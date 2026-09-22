# SoundHandler

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundHandler

## Class signature

```java
public class SoundHandler extends java.lang.Object implements IResourceManagerReloadListener, ITickable
```

## Constructors

- `SoundHandler(IResourceManager manager, GameSettings gameSettingsIn)`

## Methods

- `void addListener(ISoundEventListener listener)`
- `SoundEventAccessor getAccessor(ResourceLocation location)`
- `protected java.util.Map<java.lang.String, SoundList> getSoundMap(java.io.InputStream stream)`
- `boolean isSoundPlaying(ISound sound)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void pauseSounds()`
- `void playDelayedSound(ISound sound, int delay)`
- `void playSound(ISound sound)`
- `void removeListener(ISoundEventListener listener)`
- `void resumeSounds()`
- `void setListener(Entity entity, float partialTicks)`
- `void setListener(EntityPlayer player, float p_147691_2_)`
- `void setSoundLevel(SoundCategory category, float volume)`
- `void stop(java.lang.String p_189520_1_, SoundCategory p_189520_2_)`
- `void stopSound(ISound soundIn)`
- `void stopSounds()`
- `void unloadSounds()`
- `void update()`

## Fields

- `static Sound MISSING_SOUND`