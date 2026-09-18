---
title: "LoadController"
description: "Deprecated."
package: "net/minecraftforge/fml/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/LoadController.html"
sourceType: javadoc
---

# LoadController

## Class signature

```java
public class LoadController extends java.lang.Object
```

## Constructors

- `public LoadController( Loader loader)`

## Methods

- `public void buildModList( FMLLoadEvent event)`
- `public void distributeStateMessage( LoaderState state, java.lang.Object... eventData)`
- `public void transition( LoaderState desiredState, boolean forceState)`
- `@Deprecated public void checkErrorsAfterAvailable()`
- `@Deprecated public void checkErrors()`
- `public ModContainer activeContainer()`
- `public void propogateStateMessage( FMLEvent stateEvent)`
- `public <any> buildModObjectList()`
- `public void errorOccurred( ModContainer modContainer, java.lang.Throwable exception)`
- `public void printModStates(java.lang.StringBuilder ret)`
- `public java.util.List< ModContainer > getActiveModList()`
- `public LoaderState.ModState getModState( ModContainer selectedMod)`
- `public void distributeStateMessage(java.lang.Class<?> customEvent)`
- `public <any> getModObjectList()`
- `public boolean isInState( LoaderState state)`

## Description

Deprecated.
