---
title: "RenderItemInFrameEvent"
description: "This event is called when an item is rendered in an item frame. You can set canceled to do no further vanilla processing."
package: "net/minecraftforge/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/RenderItemInFrameEvent.html"
sourceType: javadoc
---

# RenderItemInFrameEvent

## Class signature

```java
public class RenderItemInFrameEvent extends Event
```

## Constructors

- `public RenderItemInFrameEvent( EntityItemFrame itemFrame, RenderItemFrame renderItemFrame)`

## Methods

- `public ItemStack getItem()`
- `public EntityItemFrame getEntityItemFrame()`
- `public RenderItemFrame getRenderer()`

## Description

This event is called when an item is rendered in an item frame. You can set canceled to do no further vanilla processing.
