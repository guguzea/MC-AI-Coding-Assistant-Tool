# OBJModel.MaterialLibrary

## Constructors

- `public MaterialLibrary()`

## Methods

- `public OBJModel.MaterialLibrary makeLibWithReplacements(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> replacements)`
- `public java.util.Map<java.lang.String, OBJModel.Group > getGroups()`
- `public java.util.List< OBJModel.Group > getGroupsContainingFace( OBJModel.Face f)`
- `public void changeMaterialColor(java.lang.String name, int color)`
- `public OBJModel.Material getMaterial(java.lang.String name)`
- `public com.google.common.collect.ImmutableList<java.lang.String> getMaterialNames()`
- `public void parseMaterials( IResourceManager manager, java.lang.String path, ResourceLocation from) throws java.io.IOException`