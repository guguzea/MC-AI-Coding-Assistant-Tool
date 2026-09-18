# PlayerEvent

## Class signature

```java
public class PlayerEvent extends LivingEvent
```

## Constructors

- `public PlayerEvent( EntityPlayer player)`

## Methods

- `public EntityPlayer getEntityPlayer()`

## Description

PlayerEvent is fired whenever an event involving Living entities occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. All children of this