---
title: "RenderSpecificHandEvent"
description: "This event is fired on the MinecraftForge.EVENT_BUS whenever a hand is rendered in first person. Canceling the event causes the hand to not render. TODO This may get merged in 11 with RenderHandEvent "
package: "net/minecraftforge/client/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/RenderSpecificHandEvent.html"
sourceType: javadoc
---

# RenderSpecificHandEvent

## Class signature

```java
public class RenderSpecificHandEvent extends Event
```

## Constructors

- `public RenderSpecificHandEvent( EnumHand hand, float partialTicks, float interpolatedPitch, float swingProgress, float equipProgress, @Nonnull ItemStack stack)`

## Methods

- `public EnumHand getHand()`
- `public float getPartialTicks()`
- `public float getInterpolatedPitch()`
- `public float getSwingProgress()`
- `public float getEquipProgress()`
- `@Nonnull public ItemStack getItemStack()`

## Description

This event is fired on the MinecraftForge.EVENT_BUS whenever a hand is rendered in first person. Canceling the event causes the hand to not render. TODO This may get merged in 11 with RenderHandEvent 
