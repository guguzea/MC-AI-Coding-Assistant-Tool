---
title: "OBJModel.OBJState"
description: "public static class OBJModel.OBJState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model/obj"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/obj/OBJModel.OBJState.html"
sourceType: javadoc
---

# OBJModel.OBJState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel.OBJState

## Class signature

```java
public static class OBJModel.OBJState extends java.lang.Object implements IModelState
```

## Constructors

- `OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility)`
- `OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility, IModelState parent)`

## Methods

- `<any> apply(<any> part)`
- `void changeGroupVisibilities(java.util.List<java.lang.String> names, OBJModel.OBJState.Operation operation)`
- `boolean equals(java.lang.Object obj)`
- `java.util.List<java.lang.String> getGroupNamesFromMap()`
- `java.util.List<java.lang.String> getGroupsWithVisibility(boolean visibility)`
- `IModelState getParent(IModelState parent)`
- `java.util.Map<java.lang.String, java.lang.Boolean> getVisibilityMap()`
- `int hashCode()`
- `java.lang.String toString()`

## Fields

- `protected OBJModel.OBJState.Operation operation`
- `IModelState parent`
- `protected java.util.Map<java.lang.String, java.lang.Boolean> visibilityMap`
