---
title: "OBJModel.OBJState"
description: "public static class OBJModel.OBJState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model/obj"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/obj/OBJModel.OBJState.html"
sourceType: javadoc
---

# OBJModel.OBJState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel.OBJState

## Class signature

```java
public static class OBJModel.OBJState extends java.lang.Object implements IModelState
```

## Constructors

- `@Deprecated OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility)`
- `@Deprecated OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility, IModelState parent)`

## Methods

- `@Deprecated java.util.Optional<TRSRTransformation> apply(java.util.Optional<? extends IModelPart> part)`
- `@Deprecated void changeGroupVisibilities(java.util.List<java.lang.String> names, OBJModel.OBJState.Operation operation)`
- `@Deprecated boolean equals(java.lang.Object obj)`
- `@Deprecated java.util.List<java.lang.String> getGroupNamesFromMap()`
- `@Deprecated java.util.List<java.lang.String> getGroupsWithVisibility(boolean visibility)`
- `@Deprecated IModelState getParent(IModelState parent)`
- `@Deprecated java.util.Map<java.lang.String, java.lang.Boolean> getVisibilityMap()`
- `@Deprecated int hashCode()`
- `@Deprecated java.lang.String toString()`

## Fields

- `protected OBJModel.OBJState.Operation operation`
- `IModelState parent`
- `protected java.util.Map<java.lang.String, java.lang.Boolean> visibilityMap`
