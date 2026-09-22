---
title: "RenderLivingEvent"
description: "public abstract class RenderLivingEvent<T extends EntityLivingBase> extends Event"
package: "net/minecraftforge/client/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/RenderLivingEvent.html"
sourceType: javadoc
---

# RenderLivingEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderLivingEvent<T>

## Class signature

```java
public abstract class RenderLivingEvent<T extends EntityLivingBase> extends Event
```

## Constructors

- `RenderLivingEvent(EntityLivingBase entity, RenderLivingBase<T> renderer, double x, double y, double z)`

## Methods

- `EntityLivingBase getEntity()`
- `RenderLivingBase<T> getRenderer()`
- `double getX()`
- `double getY()`
- `double getZ()`
