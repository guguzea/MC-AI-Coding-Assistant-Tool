---
title: "ForgeHooksClient"
description: "internal, relies on fixed format of FaceBakery"
package: "net/minecraftforge/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/ForgeHooksClient.html"
sourceType: javadoc
---

# ForgeHooksClient

## Class signature

```java
public class ForgeHooksClient extends java.lang.Object
```

## Constructors

- `public ForgeHooksClient()`

## Methods

- `public static java.lang.String getArmorTexture( Entity entity, ItemStack armor, java.lang.String _default, int slot, java.lang.String type)`
- `public static void orientBedCamera( IBlockAccess world, BlockPos pos, IBlockState state, Entity entity)`
- `public static boolean onDrawBlockHighlight( RenderGlobal context, EntityPlayer player, MovingObjectPosition target, int subID, ItemStack currentItem, float partialTicks)`
- `public static void dispatchRenderLast( RenderGlobal context, float partialTicks)`
- `public static boolean renderFirstPersonHand( RenderGlobal context, float partialTicks, int renderPass)`
- `public static void onTextureStitchedPre( TextureMap map)`
- `public static void onTextureStitchedPost( TextureMap map)`
- `public static void setRenderPass(int pass)`
- `public static void setRenderLayer( EnumWorldBlockLayer layer)`
- `public static ModelBiped getArmorModel( EntityLivingBase entityLiving, ItemStack itemStack, int slotID, ModelBiped _default)`
- `public static java.lang.String fixDomain(java.lang.String base, java.lang.String complex)`
- `public static boolean postMouseEvent()`
- `public static float getOffsetFOV( EntityPlayer entity, float fov)`
- `public static float getFOVModifier( EntityRenderer renderer, Entity entity, Block block, double renderPartialTicks, float fov)`
- `public static int getSkyBlendColour( World world, BlockPos center)`
- `public static void renderMainMenu( GuiMainMenu gui, FontRenderer font, int width, int height)`
- `public static ISound playSound( SoundManager manager, ISound sound)`
- `public static int getWorldRenderPass()`
- `public static void drawScreen( GuiScreen screen, int mouseX, int mouseY, float partialTicks)`
- `public static float getFogDensity( EntityRenderer renderer, Entity entity, Block block, float partial, float density)`
- `public static void onFogRender( EntityRenderer renderer, Entity entity, Block block, float partial, int mode, float distance)`
- `public static void onModelBake( ModelManager modelManager, IRegistry < ModelResourceLocation , IBakedModel > modelRegistry, ModelBakery modelBakery)`
- `public static Matrix4f getMatrix( ItemTransformVec3f transform)`
- `public static IBakedModel handleCameraTransforms( IBakedModel model, ItemCameraTransforms.TransformType cameraTransformType)`
- `public static void multiplyCurrentGlMatrix( Matrix4f matrix)`
- `public static void preDraw( VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `public static void postDraw( VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `public static void transform(org.lwjgl.util.vector.Vector3f vec, Matrix4f m)`
- `public static Matrix4f getMatrix( ModelRotation modelRotation)`
- `public static void putQuadColor( WorldRenderer renderer, BakedQuad quad, int color)`
- `public static void renderTileItem( Item item, int metadata)`
- `@Deprecated public static void registerTESRItemStack( Item item, int metadata, java.lang.Class<? extends TileEntity > TileClass)`
- `public static void fillNormal(int[] faceData, EnumFacing facing)`
- `public static <any> applyTransform( ItemTransformVec3f transform, <any> part)`
- `public static <any> applyTransform( Matrix4f matrix, <any> part)`
- `public static void loadEntityShader( Entity entity, EntityRenderer entityRenderer)`

## Description

internal, relies on fixed format of FaceBakery
