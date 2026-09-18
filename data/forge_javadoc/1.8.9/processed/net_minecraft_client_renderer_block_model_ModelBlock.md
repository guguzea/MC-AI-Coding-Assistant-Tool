# ModelBlock

## Class signature

```java
public class ModelBlock extends java.lang.Object
```

## Constructors

- `protected ModelBlock(java.util.List< BlockPart > p_i46225_1_, java.util.Map<java.lang.String,java.lang.String> p_i46225_2_, boolean p_i46225_3_, boolean p_i46225_4_, ItemCameraTransforms p_i46225_5_)`
- `protected ModelBlock( ResourceLocation p_i46226_1_, java.util.Map<java.lang.String,java.lang.String> p_i46226_2_, boolean p_i46226_3_, boolean p_i46226_4_, ItemCameraTransforms p_i46226_5_)`
- `public ModelBlock( ResourceLocation parentLocationIn, java.util.List< BlockPart > elementsIn, java.util.Map<java.lang.String,java.lang.String> texturesIn, boolean ambientOcclusionIn, boolean gui3dIn, ItemCameraTransforms cameraTransformsIn)`

## Methods

- `public static ModelBlock deserialize(java.io.Reader p_178307_0_)`
- `public static ModelBlock deserialize(java.lang.String p_178294_0_)`
- `public java.util.List< BlockPart > getElements()`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isResolved()`
- `public void getParentFromMap(java.util.Map< ResourceLocation , ModelBlock > p_178299_1_)`
- `public boolean isTexturePresent(java.lang.String textureName)`
- `public java.lang.String resolveTextureName(java.lang.String textureName)`
- `public ResourceLocation getParentLocation()`
- `public ModelBlock getRootModel()`
- `public ItemCameraTransforms func_181682_g()`
- `public static void checkModelHierarchy(java.util.Map< ResourceLocation , ModelBlock > p_178312_0_)`