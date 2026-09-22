---
title: "OBJModel.MaterialLibrary"
description: "public static class OBJModel.MaterialLibrary extends java.lang.Object"
package: "net/minecraftforge/client/model/obj"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/obj/OBJModel.MaterialLibrary.html"
sourceType: javadoc
---

# OBJModel.MaterialLibrary

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel.MaterialLibrary

## Class signature

```java
public static class OBJModel.MaterialLibrary extends java.lang.Object
```

## Constructors

- `MaterialLibrary()`

## Methods

- `void changeMaterialColor(java.lang.String name, int color)`
- `java.util.Map<java.lang.String, OBJModel.Group> getGroups()`
- `java.util.List<OBJModel.Group> getGroupsContainingFace(OBJModel.Face f)`
- `OBJModel.Material getMaterial(java.lang.String name)`
- `com.google.common.collect.ImmutableList<java.lang.String> getMaterialNames()`
- `OBJModel.MaterialLibrary makeLibWithReplacements(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> replacements)`
- `void parseMaterials(IResourceManager manager, java.lang.String path, ResourceLocation from)`
