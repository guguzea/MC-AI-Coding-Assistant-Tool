---
title: "PlaySoundAtEntityEvent"
description: "PlaySoundAtEntityEvent is fired a sound is to be played at an Entity This event is fired whenever a sound is set to be played at an Entity such as in EntityPlayerSP.playSound(SoundEvent, float, float)"
package: "net/minecraftforge/event/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/PlaySoundAtEntityEvent.html"
sourceType: javadoc
---

# PlaySoundAtEntityEvent

## Class signature

```java
public class PlaySoundAtEntityEvent extends EntityEvent
```

## Constructors

- `public PlaySoundAtEntityEvent( Entity entity, SoundEvent name, SoundCategory category, float volume, float pitch)`

## Methods

- `public SoundEvent getSound()`
- `public SoundCategory getCategory()`
- `public float getDefaultVolume()`
- `public float getDefaultPitch()`
- `public float getVolume()`
- `public float getPitch()`
- `public void setSound( SoundEvent value)`
- `public void setCategory( SoundCategory category)`
- `public void setVolume(float value)`
- `public void setPitch(float value)`

## Description

PlaySoundAtEntityEvent is fired a sound is to be played at an Entity This event is fired whenever a sound is set to be played at an Entity such as in EntityPlayerSP.playSound(SoundEvent, float, float)
