---
title: "PlaySoundAtEntityEvent"
description: "public class PlaySoundAtEntityEvent extends EntityEvent"
package: "net/minecraftforge/event/entity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/PlaySoundAtEntityEvent.html"
sourceType: javadoc
---

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
