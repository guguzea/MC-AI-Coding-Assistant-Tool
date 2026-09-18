---
title: "EntityViewRenderEvent"
description: "Event that hooks into EntityRenderer, allowing any feature to customize visual attributes the player sees."
package: "net/minecraftforge/client/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/event/EntityViewRenderEvent.html"
sourceType: javadoc
---

# EntityViewRenderEvent

## Class signature

```java
public abstract class EntityViewRenderEvent extends Event
```

## Constructors

- `public EntityViewRenderEvent( EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks)`

## Methods

- `public EntityRenderer getRenderer()`
- `public Entity getEntity()`
- `public IBlockState getState()`
- `public double getRenderPartialTicks()`

## Description

Event that hooks into EntityRenderer, allowing any feature to customize visual attributes the player sees.
