---
title: "RenderLivingEvent"
description: "public abstract class RenderLivingEvent<T extends EntityLivingBase> extends Event"
package: "net/minecraftforge/client/event"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/RenderLivingEvent.html"
sourceType: javadoc
---

# RenderLivingEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderLivingEvent<T>

## Class signature

```java
public abstract class RenderLivingEvent<T extends EntityLivingBase> extends Event
```

## Constructors

- `@Deprecated RenderLivingEvent(EntityLivingBase entity, RenderLivingBase<T> renderer, double x, double y, double z)`
- `RenderLivingEvent(EntityLivingBase entity, RenderLivingBase<T> renderer, float partialRenderTick, double x, double y, double z)`

## Methods

- `EntityLivingBase getEntity()`
- `float getPartialRenderTick()`
- `RenderLivingBase<T> getRenderer()`
- `double getX()`
- `double getY()`
- `double getZ()`
