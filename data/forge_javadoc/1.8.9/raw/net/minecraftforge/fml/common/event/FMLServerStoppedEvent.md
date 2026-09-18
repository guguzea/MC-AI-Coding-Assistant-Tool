---
title: "FMLServerStoppedEvent"
description: "Called after FMLServerStoppingEvent when the server has completely shut down. Called immediately before shutting down, on the dedicated server, and before returning to the main menu on the client."
package: "net/minecraftforge/fml/common/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/event/FMLServerStoppedEvent.html"
sourceType: javadoc
---

# FMLServerStoppedEvent

## Class signature

```java
public class FMLServerStoppedEvent extends FMLStateEvent
```

## Constructors

- `public FMLServerStoppedEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`

## Description

Called after FMLServerStoppingEvent when the server has completely shut down. Called immediately before shutting down, on the dedicated server, and before returning to the main menu on the client.
