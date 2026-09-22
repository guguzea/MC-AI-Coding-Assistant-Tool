---
title: "ForgeHooksClient"
description: "public class ForgeHooksClient extends java.lang.Object"
package: "net/minecraftforge/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/ForgeHooksClient.html"
sourceType: javadoc
---

# ForgeHooksClient

**Inheritance:** java.lang.Object → net.minecraftforge.client.ForgeHooksClient

## Class signature

```java
public class ForgeHooksClient extends java.lang.Object
```

## Constructors

- `ForgeHooksClient()`

## Methods

- `static<any> applyTransform(ItemTransformVec3f transform, <any> part)`
- `static<any> applyTransform(Matrix4f matrix, <any> part)`
- `static void dispatchRenderLast(RenderGlobal context, float partialTicks)`
- `static void drawScreen(GuiScreen screen, int mouseX, int mouseY, float partialTicks)`
- `static void fillNormal(int[] faceData, EnumFacing facing)` — internal, relies on fixed format of FaceBakery
- `static java.lang.String fixDomain(java.lang.String base, java.lang.String complex)`
- `static ModelBiped getArmorModel(EntityLivingBase entityLiving, ItemStack itemStack, int slotID, ModelBiped _default)`
- `static java.lang.String getArmorTexture(Entity entity, ItemStack armor, java.lang.String _default, int slot, java.lang.String type)`
- `static float getFogDensity(EntityRenderer renderer, Entity entity, Block block, float partial, float density)`
- `static float getFOVModifier(EntityRenderer renderer, Entity entity, Block block, double renderPartialTicks, float fov)`
- `static Matrix4f getMatrix(ItemTransformVec3f transform)`
- `static Matrix4f getMatrix(ModelRotation modelRotation)`
- `static float getOffsetFOV(EntityPlayer entity, float fov)`
- `static int getSkyBlendColour(World world, BlockPos center)`
- `static int getWorldRenderPass()`
- `static IBakedModel handleCameraTransforms(IBakedModel model, ItemCameraTransforms.TransformType cameraTransformType)`
- `static void loadEntityShader(Entity entity, EntityRenderer entityRenderer)`
- `static void multiplyCurrentGlMatrix(Matrix4f matrix)`
- `static boolean onDrawBlockHighlight(RenderGlobal context, EntityPlayer player, MovingObjectPosition target, int subID, ItemStack currentItem, float partialTicks)`
- `static void onFogRender(EntityRenderer renderer, Entity entity, Block block, float partial, int mode, float distance)`
- `static void onModelBake(ModelManager modelManager, IRegistry<ModelResourceLocation, IBakedModel> modelRegistry, ModelBakery modelBakery)`
- `static void onTextureStitchedPost(TextureMap map)`
- `static void onTextureStitchedPre(TextureMap map)`
- `static void orientBedCamera(IBlockAccess world, BlockPos pos, IBlockState state, Entity entity)`
- `static ISound playSound(SoundManager manager, ISound sound)`
- `static void postDraw(VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `static boolean postMouseEvent()`
- `static void preDraw(VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `static void putQuadColor(WorldRenderer renderer, BakedQuad quad, int color)`
- `@Deprecated static void registerTESRItemStack(Item item, int metadata, java.lang.Class<? extends TileEntity> TileClass)` — Deprecated. Will be removed as soon as possible, hopefully 1.9.
- `static boolean renderFirstPersonHand(RenderGlobal context, float partialTicks, int renderPass)`
- `static void renderMainMenu(GuiMainMenu gui, FontRenderer font, int width, int height)`
- `static void renderTileItem(Item item, int metadata)`
- `static void setRenderLayer(EnumWorldBlockLayer layer)`
- `static void setRenderPass(int pass)`
- `static void transform(org.lwjgl.util.vector.Vector3f vec, Matrix4f m)`
