# RenderItem

## Class signature

```java
public class RenderItem extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public RenderItem( TextureManager p_i46552_1_, ModelManager p_i46552_2_, ItemColors p_i46552_3_)`

## Methods

- `public ItemModelMesher getItemModelMesher()`
- `protected void registerItem( Item itm, int subType, java.lang.String identifier)`
- `protected void registerBlock( Block blk, int subType, java.lang.String identifier)`
- `public void renderItem( ItemStack stack, IBakedModel model)`
- `public void renderQuads( BufferBuilder renderer, java.util.List< BakedQuad > quads, int color, ItemStack stack)`
- `public boolean shouldRenderItemIn3D( ItemStack stack)`
- `public void renderItem( ItemStack stack, ItemCameraTransforms.TransformType cameraTransformType)`
- `public IBakedModel getItemModelWithOverrides( ItemStack stack, World worldIn, EntityLivingBase entitylivingbaseIn)`
- `public void renderItem( ItemStack stack, EntityLivingBase entitylivingbaseIn, ItemCameraTransforms.TransformType transform, boolean leftHanded)`
- `protected void renderItemModel( ItemStack stack, IBakedModel bakedmodel, ItemCameraTransforms.TransformType transform, boolean leftHanded)`
- `public void renderItemIntoGUI( ItemStack stack, int x, int y)`
- `protected void renderItemModelIntoGUI( ItemStack stack, int x, int y, IBakedModel bakedmodel)`
- `public void renderItemAndEffectIntoGUI( ItemStack stack, int xPosition, int yPosition)`
- `public void renderItemAndEffectIntoGUI( EntityLivingBase p_184391_1_, ItemStack p_184391_2_, int p_184391_3_, int p_184391_4_)`
- `public void renderItemOverlays( FontRenderer fr, ItemStack stack, int xPosition, int yPosition)`
- `public void renderItemOverlayIntoGUI( FontRenderer fr, ItemStack stack, int xPosition, int yPosition, java.lang.String text)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`