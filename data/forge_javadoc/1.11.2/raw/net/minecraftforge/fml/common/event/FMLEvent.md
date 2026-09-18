---
title: "FMLEvent"
description: "Parent type to all FML events. This is based on Guava EventBus. Event Subscription isn't using the Guava annotation however, it's using a custom annotation specific to FML Mod.EventHandler"
package: "net/minecraftforge/fml/common/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/event/FMLEvent.html"
sourceType: javadoc
---

# FMLEvent

## Class signature

```java
public class FMLEvent extends java.lang.Object
```

## Constructors

- `public FMLEvent()`

## Methods

- `public final java.lang.String getEventType()`
- `public final java.lang.String description()`
- `public void applyModContainer( ModContainer activeContainer)`

## Description

Parent type to all FML events. This is based on Guava EventBus. Event Subscription isn't using the Guava annotation however, it's using a custom annotation specific to FML Mod.EventHandler
