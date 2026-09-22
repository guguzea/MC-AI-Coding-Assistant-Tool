---
title: "MapModelState"
description: "public class MapModelState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/MapModelState.html"
sourceType: javadoc
---

# MapModelState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MapModelState

## Class signature

```java
public class MapModelState extends java.lang.Object implements IModelState
```

## Constructors

- `MapModelState(java.util.Map<MapModelState.Wrapper, IModelState> map)`
- `MapModelState(java.util.Map<MapModelState.Wrapper, IModelState> map, IModelState def)`
- `MapModelState(java.util.Map<MapModelState.Wrapper, IModelState> map, TRSRTransformation def)`

## Methods

- `java.util.Optional<TRSRTransformation> apply(java.util.Optional<? extends IModelPart> part)`
- `IModelState getState(java.lang.Object obj)`
- `static MapModelState.Wrapper wrap(java.lang.Object obj)`
