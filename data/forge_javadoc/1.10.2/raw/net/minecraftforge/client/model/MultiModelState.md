---
title: "MultiModelState"
description: "public final class MultiModelState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/MultiModelState.html"
sourceType: javadoc
---

# MultiModelState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModelState

## Class signature

```java
public final class MultiModelState extends java.lang.Object implements IModelState
```

## Constructors

- `MultiModelState(com.google.common.collect.ImmutableList<org.apache.commons.lang3.tuple.Pair<M, S>> states)`

## Methods

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`
- `static IModelState getPartState(IModelState state, IModel model, int index)`
