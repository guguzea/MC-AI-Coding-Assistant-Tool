# PlaySoundAtEntityEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.PlaySoundAtEntityEvent

## Class signature

```java
public class PlaySoundAtEntityEvent extends EntityEvent
```

## Constructors

- `PlaySoundAtEntityEvent(Entity entity, SoundEvent name, SoundCategory category, float volume, float pitch)`

## Methods

- `SoundCategory getCategory()`
- `float getDefaultPitch()`
- `float getDefaultVolume()`
- `float getPitch()`
- `SoundEvent getSound()`
- `float getVolume()`
- `void setCategory(SoundCategory category)`
- `void setPitch(float value)`
- `void setSound(SoundEvent value)`
- `void setVolume(float value)`