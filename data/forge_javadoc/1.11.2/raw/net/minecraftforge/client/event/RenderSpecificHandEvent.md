---
title: "RenderSpecificHandEvent"
description: "public class RenderSpecificHandEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/RenderSpecificHandEvent.html"
sourceType: javadoc
---

# RenderSpecificHandEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderSpecificHandEvent

## Class signature

```java
public class RenderSpecificHandEvent extends Event
```

## Constructors

- `RenderSpecificHandEvent(EnumHand hand, float partialTicks, float interpolatedPitch, float swingProgress, float equipProgress, ItemStack stack)`

## Methods

- `float getEquipProgress()`
- `EnumHand getHand()`
- `float getInterpolatedPitch()`
- `ItemStack getItemStack()`
- `float getPartialTicks()`
- `float getSwingProgress()`
