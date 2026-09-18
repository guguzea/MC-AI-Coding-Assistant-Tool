---
title: "ModelBlock"
description: "public class ModelBlock extends java.lang.Object"
package: "net/minecraft/client/renderer/block/model"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/block/model/ModelBlock.html"
sourceType: javadoc
---

# ModelBlock

## Class signature

```java
public class ModelBlock extends java.lang.Object
```

## Constructors

- `public ModelBlock(@Nullable ResourceLocation parentLocationIn, java.util.List< BlockPart > elementsIn, java.util.Map<java.lang.String,java.lang.String> texturesIn, boolean ambientOcclusionIn, boolean gui3dIn, ItemCameraTransforms cameraTransformsIn, java.util.List< ItemOverride > overridesIn)`

## Methods

- `public static ModelBlock deserialize(java.io.Reader readerIn)`
- `public static ModelBlock deserialize(java.lang.String jsonString)`
- `public java.util.List< BlockPart > getElements()`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isResolved()`
- `public void getParentFromMap(java.util.Map< ResourceLocation , ModelBlock > p_178299_1_)`
- `public java.util.Collection< ResourceLocation > getOverrideLocations()`
- `public java.util.List< ItemOverride > getOverrides()`
- `public ItemOverrideList createOverrides()`
- `public boolean isTexturePresent(java.lang.String textureName)`
- `public java.lang.String resolveTextureName(java.lang.String textureName)`
- `@Nullable public ResourceLocation getParentLocation()`
- `public ModelBlock getRootModel()`
- `public ItemCameraTransforms getAllTransforms()`
- `public static void checkModelHierarchy(java.util.Map< ResourceLocation , ModelBlock > p_178312_0_)`
