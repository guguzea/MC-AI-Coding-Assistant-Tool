# ModelBlock

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ModelBlock

## Class signature

```java
public class ModelBlock extends java.lang.Object
```

## Constructors

- `ModelBlock(java.util.List<BlockPart> p_i46225_1_, java.util.Map<java.lang.String, java.lang.String> p_i46225_2_, boolean p_i46225_3_, boolean p_i46225_4_, ItemCameraTransforms p_i46225_5_)`
- `ModelBlock(ResourceLocation parentLocationIn, java.util.List<BlockPart> elementsIn, java.util.Map<java.lang.String, java.lang.String> texturesIn, boolean ambientOcclusionIn, boolean gui3dIn, ItemCameraTransforms cameraTransformsIn)`
- `ModelBlock(ResourceLocation p_i46226_1_, java.util.Map<java.lang.String, java.lang.String> p_i46226_2_, boolean p_i46226_3_, boolean p_i46226_4_, ItemCameraTransforms p_i46226_5_)`

## Methods

- `static void checkModelHierarchy(java.util.Map<ResourceLocation, ModelBlock> p_178312_0_)`
- `static ModelBlock deserialize(java.io.Reader p_178307_0_)`
- `static ModelBlock deserialize(java.lang.String p_178294_0_)`
- `ItemCameraTransforms func_181682_g()`
- `java.util.List<BlockPart> getElements()`
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