# RenderItem

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.RenderItem

## Class signature

```java
public class RenderItem extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `RenderItem(TextureManager p_i46552_1_, ModelManager p_i46552_2_, ItemColors p_i46552_3_)`

## Methods

- `ItemModelMesher getItemModelMesher()`
- `IBakedModel getItemModelWithOverrides(ItemStack stack, World worldIn, EntityLivingBase entitylivingbaseIn)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected void registerBlock(Block blk, int subType, java.lang.String identifier)`
- `protected void registerItem(Item itm, int subType, java.lang.String identifier)`
- `void renderItem(ItemStack stack, EntityLivingBase entitylivingbaseIn, ItemCameraTransforms.TransformType transform, boolean leftHanded)`
- `void renderItem(ItemStack stack, IBakedModel model)`
- `void renderItem(ItemStack stack, ItemCameraTransforms.TransformType cameraTransformType)`
- `void renderItemAndEffectIntoGUI(EntityLivingBase p_184391_1_, ItemStack p_184391_2_, int p_184391_3_, int p_184391_4_)`
- `void renderItemAndEffectIntoGUI(ItemStack stack, int xPosition, int yPosition)`
- `void renderItemIntoGUI(ItemStack stack, int x, int y)`
- `protected void renderItemModel(ItemStack stack, IBakedModel bakedmodel, ItemCameraTransforms.TransformType transform, boolean leftHanded)`
- `protected void renderItemModelIntoGUI(ItemStack stack, int x, int y, IBakedModel bakedmodel)`
- `void renderItemOverlayIntoGUI(FontRenderer fr, ItemStack stack, int xPosition, int yPosition, java.lang.String text)`
- `void renderItemOverlays(FontRenderer fr, ItemStack stack, int xPosition, int yPosition)`
- `void renderQuads(BufferBuilder renderer, java.util.List<BakedQuad> quads, int color, ItemStack stack)`
- `boolean shouldRenderItemIn3D(ItemStack stack)`

## Fields

- `float zLevel`