# PlayerSPPushOutOfBlocksEvent

## Class signature

```java
public class PlayerSPPushOutOfBlocksEvent extends PlayerEvent
```

## Constructors

- `public PlayerSPPushOutOfBlocksEvent( EntityPlayer player, AxisAlignedBB entityBoundingBox)`

## Methods

- `public AxisAlignedBB getEntityBoundingBox()`
- `public void setEntityBoundingBox( AxisAlignedBB entityBoundingBox)`

## Description

This event is called before the pushOutOfBlocks calls in EntityPlayerSP. Cancelling the event will prevent pushOutOfBlocks from being called.