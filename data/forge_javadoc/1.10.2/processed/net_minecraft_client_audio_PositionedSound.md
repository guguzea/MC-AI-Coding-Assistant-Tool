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