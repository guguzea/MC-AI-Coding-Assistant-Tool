# RenderItem

## Class signature

```java
public class RenderItem extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public RenderItem( TextureManager textureManager, ModelManager modelManager)`

## Methods

- `public void func_175039_a(boolean p_175039_1_)`
- `public ItemModelMesher getItemModelMesher()`
- `protected void registerItem( Item itm, int subType, java.lang.String identifier)`
- `protected void registerBlock( Block blk, int subType, java.lang.String identifier)`
- `public void renderItem( ItemStack stack, IBakedModel model)`
- `public boolean shouldRenderItemIn3D( ItemStack stack)`
- `public void renderItem( ItemStack p_181564_1_, ItemCameraTransforms.TransformType p_181564_2_)`
- `public void renderItemModelForEntity( ItemStack stack, EntityLivingBase entityToRenderFor, ItemCameraTransforms.TransformType cameraTransformType)`
- `protected void renderItemModelTransform( ItemStack stack, IBakedModel model, ItemCameraTransforms.TransformType cameraTransformType)`
- `public void renderItemIntoGUI( ItemStack stack, int x, int y)`
- `public void renderItemAndEffectIntoGUI( ItemStack stack, int xPosition, int yPosition)`
- `public void renderItemOverlays( FontRenderer fr, ItemStack stack, int xPosition, int yPosition)`
- `public void renderItemOverlayIntoGUI( FontRenderer fr, ItemStack stack, int xPosition, int yPosition, java.lang.String text)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`

## Description

Defines the zLevel of rendering of item on GUI.