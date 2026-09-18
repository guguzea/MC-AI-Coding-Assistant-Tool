---
title: "PlayerSPPushOutOfBlocksEvent"
description: "This event is called before the pushOutOfBlocks calls in EntityPlayerSP. Cancelling the event will prevent pushOutOfBlocks from being called."
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/PlayerSPPushOutOfBlocksEvent.html"
sourceType: javadoc
---

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
