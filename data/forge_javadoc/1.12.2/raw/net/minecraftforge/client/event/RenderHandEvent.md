---
title: "RenderHandEvent"
description: "This event is fired on MinecraftForge.EVENT_BUS before both hands are rendered. Canceling this event prevents either hand from being rendered, and prevents RenderSpecificHandEvent from firing. TODO Th"
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/RenderHandEvent.html"
sourceType: javadoc
---

# RenderHandEvent

## Class signature

```java
public class RenderHandEvent extends Event
```

## Constructors

- `public RenderHandEvent( RenderGlobal context, float partialTicks, int renderPass)`

## Methods

- `public RenderGlobal getContext()`
- `public float getPartialTicks()`
- `public int getRenderPass()`

## Description

This event is fired on MinecraftForge.EVENT_BUS before both hands are rendered. Canceling this event prevents either hand from being rendered, and prevents RenderSpecificHandEvent from firing. TODO Th
