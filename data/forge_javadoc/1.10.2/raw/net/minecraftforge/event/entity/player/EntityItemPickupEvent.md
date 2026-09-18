---
title: "EntityItemPickupEvent"
description: "This event is called when a player collides with a EntityItem on the ground. The event can be canceled, and no further processing will be done. You can set the result of this event to ALLOW which will"
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/EntityItemPickupEvent.html"
sourceType: javadoc
---

# EntityItemPickupEvent

## Class signature

```java
public class EntityItemPickupEvent extends PlayerEvent
```

## Constructors

- `public EntityItemPickupEvent( EntityPlayer player, EntityItem item)`

## Methods

- `public EntityItem getItem()`

## Description

This event is called when a player collides with a EntityItem on the ground. The event can be canceled, and no further processing will be done. You can set the result of this event to ALLOW which will
