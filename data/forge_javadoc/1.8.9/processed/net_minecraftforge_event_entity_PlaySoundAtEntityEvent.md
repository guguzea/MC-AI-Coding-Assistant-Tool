# PlaySoundAtEntityEvent

## Class signature

```java
public class PlaySoundAtEntityEvent extends EntityEvent
```

## Constructors

- `public PlaySoundAtEntityEvent( Entity entity, java.lang.String name, float volume, float pitch)`

## Description

PlaySoundAtEntityEvent is fired a sound is to be played at an Entity This event is fired whenever a sound is set to be played at an Entity such as in EntityPlayerSP#playSound(String, float, float), Wo