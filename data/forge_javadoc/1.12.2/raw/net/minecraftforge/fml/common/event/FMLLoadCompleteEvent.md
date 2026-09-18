---
title: "FMLLoadCompleteEvent"
description: "This is a mostly internal event fired to mod containers that indicates that loading is complete. Mods should not in general override or otherwise attempt to implement this event."
package: "net/minecraftforge/fml/common/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/event/FMLLoadCompleteEvent.html"
sourceType: javadoc
---

# FMLLoadCompleteEvent

## Class signature

```java
public class FMLLoadCompleteEvent extends FMLStateEvent
```

## Constructors

- `public FMLLoadCompleteEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`

## Description

This is a mostly internal event fired to mod containers that indicates that loading is complete. Mods should not in general override or otherwise attempt to implement this event.
