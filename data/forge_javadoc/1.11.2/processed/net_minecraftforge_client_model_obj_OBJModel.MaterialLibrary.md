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