---
title: "FMLServerAboutToStartEvent"
description: "Called before the server begins loading anything. Called after FMLPostInitializationEvent on the dedicated server, and after the player has hit \"Play Selected World\" in the client. Called before FML"
package: "net/minecraftforge/fml/common/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/event/FMLServerAboutToStartEvent.html"
sourceType: javadoc
---

# FMLServerAboutToStartEvent

## Class signature

```java
public class FMLServerAboutToStartEvent extends FMLStateEvent
```

## Constructors

- `public FMLServerAboutToStartEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`
- `public MinecraftServer getServer()`

## Description

Called before the server begins loading anything. Called after FMLPostInitializationEvent on the dedicated server, and after the player has hit "Play Selected World" in the client. Called before FMLSe
