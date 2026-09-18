---
title: "FMLServerStoppedEvent"
description: "Called after FMLServerStoppingEvent when the server has completely shut down. Called immediately before shutting down, on the dedicated server, and before returning to the main menu on the client."
package: "net/minecraftforge/fml/common/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/event/FMLServerStoppedEvent.html"
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
