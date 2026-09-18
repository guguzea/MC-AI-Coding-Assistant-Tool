---
title: "PlaySoundEvent"
description: "Raised when the SoundManager tries to play a normal sound. If you return null from this function it will prevent the sound from being played, you can return a different entry if you want to change the"
package: "net/minecraftforge/client/event/sound"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/event/sound/PlaySoundEvent.html"
sourceType: javadoc
---

# PlaySoundEvent

## Class signature

```java
public class PlaySoundEvent extends SoundEvent
```

## Constructors

- `public PlaySoundEvent( SoundManager manager, ISound sound, SoundCategory category)`

## Description

Raised when the SoundManager tries to play a normal sound. If you return null from this function it will prevent the sound from being played, you can return a different entry if you want to change the
