# AttackEntityEvent

## Class signature

```java
public class AttackEntityEvent extends PlayerEvent
```

## Constructors

- `public AttackEntityEvent( EntityPlayer player, Entity target)`

## Methods

- `public Entity getTarget()`

## Description

AttackEntityEvent is fired when a player attacks an Entity. This event is fired whenever a player attacks an Entity in EntityPlayer.attackTargetEntityWithCurrentItem(Entity) . target contains the Enti