# PositionedSound

**Inheritance:** java.lang.Object → net.minecraft.client.audio.PositionedSound

## Class signature

```java
public abstract class PositionedSound extends java.lang.Object implements ISound
```

## Constructors

- `PositionedSound(ResourceLocation soundResource)`

## Methods

- `boolean canRepeat()`
- `ISound.AttenuationType getAttenuationType()`
- `float getPitch()`
- `int getRepeatDelay()`
- `ResourceLocation getSoundLocation()`
- `float getVolume()`
- `float getXPosF()`
- `float getYPosF()`
- `float getZPosF()`

## Fields

- `protected ISound.AttenuationType attenuationType`
- `protected float pitch`
- `protected ResourceLocation positionedSoundLocation`
- `protected boolean repeat`
- `protected int repeatDelay` — The number of ticks between repeating the sound
- `protected float volume`
- `protected float xPosF`
- `protected float yPosF`
- `protected float zPosF`