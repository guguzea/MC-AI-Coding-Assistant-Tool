---
title: "FMLPostInitializationEvent"
description: "Called after FMLInitializationEvent has been dispatched on every mod. This is the third and last commonly called event during mod initialization. Recommended activities: interact with other mods to es"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLPostInitializationEvent.html"
sourceType: javadoc
---

# FMLPostInitializationEvent

## Class signature

```java
public class FMLPostInitializationEvent extends FMLStateEvent
```

## Constructors

- `public FMLPostInitializationEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`
- `public com.google.common.base.Optional<?> buildSoftDependProxy(java.lang.String modId, java.lang.String className, java.lang.Object... arguments)`

## Description

Called after FMLInitializationEvent has been dispatched on every mod. This is the third and last commonly called event during mod initialization. Recommended activities: interact with other mods to es
