---
title: "LoadController"
description: "public class LoadController extends java.lang.Object"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/LoadController.html"
sourceType: javadoc
---

# LoadController

**Inheritance:** java.lang.Object → cpw.mods.fml.common.LoadController

## Class signature

```java
public class LoadController extends java.lang.Object
```

## Constructors

- `LoadController(Loader loader)`

## Methods

- `ModContainer activeContainer()`
- `void buildModList(FMLLoadEvent event)`
- `<any> buildModObjectList()`
- `void distributeStateMessage(java.lang.Class<?> customEvent)`
- `void distributeStateMessage(LoaderState state, java.lang.Object... eventData)`
- `void errorOccurred(ModContainer modContainer, java.lang.Throwable exception)`
- `java.util.List<ModContainer> getActiveModList()`
- `<any> getModObjectList()`
- `LoaderState.ModState getModState(ModContainer selectedMod)`
- `boolean isInState(LoaderState state)`
- `void printModStates(java.lang.StringBuilder ret)`
- `void propogateStateMessage(FMLEvent stateEvent)`
- `void transition(LoaderState desiredState, boolean forceState)`
