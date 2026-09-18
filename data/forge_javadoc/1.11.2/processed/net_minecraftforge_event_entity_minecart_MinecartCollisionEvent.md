# MinecartCollisionEvent

## Class signature

```java
public class MinecartCollisionEvent extends MinecartEvent
```

## Constructors

- `public MinecartCollisionEvent( EntityMinecart minecart, Entity collider)`

## Methods

- `public Entity getCollider()`

## Description

MinecartCollisionEvent is fired when a minecart collides with an Entity. This event is fired whenever a minecraft collides in EntityMinecart.applyEntityCollision(Entity) . collider contains the Entity