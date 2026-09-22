---
title: "RenderPlayerEvent"
description: "public abstract class RenderPlayerEvent extends PlayerEvent"
package: "net/minecraftforge/client/event"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/RenderPlayerEvent.html"
sourceType: javadoc
---

# RenderPlayerEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.client.event.RenderPlayerEvent

## Class signature

```java
public abstract class RenderPlayerEvent extends PlayerEvent
```

## Constructors

- `RenderPlayerEvent(EntityPlayer player, RenderPlayer renderer, float partialRenderTick, double x, double y, double z)`

## Methods

- `float getPartialRenderTick()`
- `RenderPlayer getRenderer()`
- `double getX()`
- `double getY()`
- `double getZ()`
