---
title: "EntityViewRenderEvent"
description: "public abstract class EntityViewRenderEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/EntityViewRenderEvent.html"
sourceType: javadoc
---

# EntityViewRenderEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.EntityViewRenderEvent

## Class signature

```java
public abstract class EntityViewRenderEvent extends Event
```

## Constructors

- `EntityViewRenderEvent(EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks)`

## Methods

- `Entity getEntity()`
- `EntityRenderer getRenderer()`
- `double getRenderPartialTicks()`
- `IBlockState getState()`
