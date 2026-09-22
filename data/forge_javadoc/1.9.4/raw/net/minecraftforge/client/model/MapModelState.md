---
title: "MapModelState"
description: "public class MapModelState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/MapModelState.html"
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

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`
- `IModelState getState(java.lang.Object obj)`
- `static MapModelState.Wrapper wrap(java.lang.Object obj)`
