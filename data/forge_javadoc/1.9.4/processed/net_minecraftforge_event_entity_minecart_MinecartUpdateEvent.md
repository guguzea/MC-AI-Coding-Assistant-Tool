# MinecartUpdateEvent

## Class signature

```java
public class MinecartUpdateEvent extends MinecartEvent
```

## Constructors

- `public MinecartUpdateEvent( EntityMinecart minecart, BlockPos pos)`

## Methods

- `public BlockPos getPos()`

## Description

MinecartUpdateEvent is fired when a minecart is updated. This event is fired whenever a minecart is updated in EntityMinecart#onUpdate(). pos contains the coordinate of the track the entity is on {if