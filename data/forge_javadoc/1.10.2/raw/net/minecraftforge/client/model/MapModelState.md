---
title: "MapModelState"
description: "public class MapModelState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/MapModelState.html"
sourceType: javadoc
---

# MapModelState

## Class signature

```java
public class MapModelState extends java.lang.Object implements IModelState
```

## Constructors

- `public MapModelState(java.util.Map< MapModelState.Wrapper , IModelState > map)`
- `public MapModelState(java.util.Map< MapModelState.Wrapper , IModelState > map, TRSRTransformation def)`
- `public MapModelState(java.util.Map< MapModelState.Wrapper , IModelState > map, IModelState def)`

## Methods

- `public com.google.common.base.Optional< TRSRTransformation > apply(com.google.common.base.Optional<? extends IModelPart > part)`
- `public IModelState getState(java.lang.Object obj)`
- `public static MapModelState.Wrapper wrap(java.lang.Object obj)`
