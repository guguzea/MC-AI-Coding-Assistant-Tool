# SoundEventAccessorComposite

## Class signature

```java
public class SoundEventAccessorComposite extends java.lang.Object implements ISoundEventAccessor < SoundPoolEntry >
```

## Constructors

- `public SoundEventAccessorComposite( ResourceLocation soundLocation, double pitch, double volume, SoundCategory category)`

## Methods

- `public int getWeight()`
- `public SoundPoolEntry cloneEntry()`
- `public void addSoundToEventPool( ISoundEventAccessor < SoundPoolEntry > sound)`
- `public ResourceLocation getSoundEventLocation()`
- `public SoundCategory getSoundCategory()`