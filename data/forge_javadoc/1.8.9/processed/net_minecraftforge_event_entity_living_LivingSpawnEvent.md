# LivingSpawnEvent

## Class signature

```java
public class LivingSpawnEvent extends LivingEvent
```

## Constructors

- `public LivingSpawnEvent( EntityLiving entity, World world, float x, float y, float z)`

## Description

LivingSpawnEvent is fired whenever a living Entity is spawned. If a method utilizes this Event as its parameter, the method will receive every child event of this class. world contains the world in wh