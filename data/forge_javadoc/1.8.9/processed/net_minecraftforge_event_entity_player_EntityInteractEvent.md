# EntityInteractEvent

## Class signature

```java
public class EntityInteractEvent extends PlayerEvent
```

## Constructors

- `public EntityInteractEvent( EntityPlayer player, Entity target)`

## Description

EntityInteractEvent is fired when a player interacts with an Entity. This event is fired whenever a player interacts with an Entity in EntityPlayer#interactWith(Entity). target contains the Entity the