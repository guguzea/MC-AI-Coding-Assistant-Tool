# PositionedSound

## Class signature

```java
public abstract class PositionedSound extends java.lang.Object implements ISound
```

## Constructors

- `protected PositionedSound( SoundEvent soundIn, SoundCategory categoryIn)`
- `protected PositionedSound( ResourceLocation soundId, SoundCategory categoryIn)`

## Methods

- `public ResourceLocation getSoundLocation()`
- `public SoundEventAccessor createAccessor( SoundHandler handler)`
- `public Sound getSound()`
- `public SoundCategory getCategory()`
- `public boolean canRepeat()`
- `public int getRepeatDelay()`
- `public float getVolume()`
- `public float getPitch()`
- `public float getXPosF()`
- `public float getYPosF()`
- `public float getZPosF()`
- `public ISound.AttenuationType getAttenuationType()`