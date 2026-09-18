---
title: "ItemExpireEvent"
description: "Event that is fired when an EntityItem's age has reached its maximum lifespan. Canceling this event will prevent the EntityItem from being flagged as dead, thus staying it's removal from the world. If"
package: "net/minecraftforge/event/entity/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/item/ItemExpireEvent.html"
sourceType: javadoc
---

# ItemExpireEvent

## Class signature

```java
public class ItemExpireEvent extends ItemEvent
```

## Constructors

- `public ItemExpireEvent( EntityItem entityItem, int extraLife)`

## Methods

- `public int getExtraLife()`
- `public void setExtraLife(int extraLife)`

## Description

Event that is fired when an EntityItem's age has reached its maximum lifespan. Canceling this event will prevent the EntityItem from being flagged as dead, thus staying it's removal from the world. If
