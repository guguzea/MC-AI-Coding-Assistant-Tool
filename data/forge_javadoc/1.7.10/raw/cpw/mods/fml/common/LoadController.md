---
title: "LoadController"
description: "public class LoadController extends java.lang.Object"
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/LoadController.html"
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
