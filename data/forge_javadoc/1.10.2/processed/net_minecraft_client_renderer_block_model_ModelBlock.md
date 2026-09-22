# ModelBlock

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ModelBlock

## Class signature

```java
public class ModelBlock extends java.lang.Object
```

## Constructors

- `ModelBlock(ResourceLocation parentLocationIn, java.util.List<BlockPart> elementsIn, java.util.Map<java.lang.String, java.lang.String> texturesIn, boolean ambientOcclusionIn, boolean gui3dIn, ItemCameraTransforms cameraTransformsIn, java.util.List<ItemOverride> overridesIn)`

## Methods

- `static void checkModelHierarchy(java.util.Map<ResourceLocation, ModelBlock> p_178312_0_)`
- `ItemOverrideList createOverrides()`
- `static ModelBlock deserialize(java.io.Reader readerIn)`
- `static ModelBlock deserialize(java.lang.String jsonString)`
- `ItemCameraTransforms getAllTransforms()`
- `java.util.List<BlockPart> getElements()`
- `java.util.Collection<ResourceLocation> getOverrideLocations()`
- `java.util.List<ItemOverride> getOverrides()`
- `void getParentFromMap(java.util.Map<ResourceLocation, ModelBlock> p_178299_1_)`
- `ResourceLocation getParentLocation()`
- `ModelBlock getRootModel()`
- `boolean isAmbientOcclusion()`
- `boolean isGui3d()`
- `boolean isResolved()`
- `boolean isTexturePresent(java.lang.String textureName)`
- `java.lang.String resolveTextureName(java.lang.String textureName)`

## Fields

- `boolean ambientOcclusion`
- `java.lang.String name`
- `ModelBlock parent`
- `protected ResourceLocation parentLocation`
- `java.util.Map<java.lang.String, java.lang.String> textures`