---
title: "EntityViewRenderEvent.CameraSetup"
description: "public static class EntityViewRenderEvent.CameraSetup extends EntityViewRenderEvent"
package: "net/minecraftforge/client/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/EntityViewRenderEvent.CameraSetup.html"
sourceType: javadoc
---

# EntityViewRenderEvent.CameraSetup

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.EntityViewRenderEvent → net.minecraftforge.client.event.EntityViewRenderEvent.CameraSetup

## Class signature

```java
public static class EntityViewRenderEvent.CameraSetup extends EntityViewRenderEvent
```

## Constructors

- `CameraSetup(EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float yaw, float pitch, float roll)`

## Methods

- `float getPitch()`
- `float getRoll()`
- `float getYaw()`
- `void setPitch(float pitch)`
- `void setRoll(float roll)`
- `void setYaw(float yaw)`
