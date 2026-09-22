# SoundEventAccessorComposite

**Inheritance:** java.lang.Object → net.minecraft.client.audio.SoundEventAccessorComposite

## Class signature

```java
public class SoundEventAccessorComposite extends java.lang.Object implements ISoundEventAccessor<SoundPoolEntry>
```

## Constructors

- `SoundEventAccessorComposite(ResourceLocation soundLocation, double pitch, double volume, SoundCategory category)`

## Methods

- `void addSoundToEventPool(ISoundEventAccessor<SoundPoolEntry> sound)`
- `SoundPoolEntry cloneEntry()`
- `SoundCategory getSoundCategory()`
- `ResourceLocation getSoundEventLocation()`
- `int getWeight()`