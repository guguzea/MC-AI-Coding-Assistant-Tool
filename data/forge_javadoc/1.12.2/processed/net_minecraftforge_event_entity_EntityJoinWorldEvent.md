# EntityJoinWorldEvent

## Class signature

```java
public class EntityJoinWorldEvent extends EntityEvent
```

## Constructors

- `public EntityJoinWorldEvent( Entity entity, World world)`

## Methods

- `public World getWorld()`

## Description

EntityJoinWorldEvent is fired when an Entity joins the world. This event is fired whenever an Entity is added to the world in World.loadEntities(Collection) , WorldServer.loadEntities(Collection) Worl