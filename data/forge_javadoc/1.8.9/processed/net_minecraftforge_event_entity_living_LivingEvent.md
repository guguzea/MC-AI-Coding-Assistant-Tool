# LivingEvent

## Class signature

```java
public class LivingEvent extends EntityEvent
```

## Constructors

- `public LivingEvent( EntityLivingBase entity)`

## Description

LivingEvent is fired whenever an event involving Living entities occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. All children of this