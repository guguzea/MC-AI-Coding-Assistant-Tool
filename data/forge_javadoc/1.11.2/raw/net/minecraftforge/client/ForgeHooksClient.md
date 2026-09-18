---
title: "ForgeHooksClient"
description: "internal, relies on fixed format of FaceBakery"
package: "net/minecraftforge/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/ForgeHooksClient.html"
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

- `public static java.lang.String getArmorTexture( Entity entity, ItemStack armor, java.lang.String _default, EntityEquipmentSlot slot, java.lang.String type)`
- `public static void orientBedCamera( IBlockAccess world, BlockPos pos, IBlockState state, Entity entity)`
- `public static boolean onDrawBlockHighlight( RenderGlobal context, EntityPlayer player, RayTraceResult target, int subID, float partialTicks)`
- `public static void dispatchRenderLast( RenderGlobal context, float partialTicks)`
- `public static boolean renderFirstPersonHand( RenderGlobal context, float partialTicks, int renderPass)`
- `public static boolean renderSpecificFirstPersonHand( EnumHand hand, float partialTicks, float interpPitch, float swingProgress, float equipProgress, ItemStack stack)`
- `public static void onTextureStitchedPre( TextureMap map)`
- `public static void onTextureStitchedPost( TextureMap map)`
- `public static void setRenderPass(int pass)`
- `public static void setRenderLayer( BlockRenderLayer layer)`
- `public static ModelBiped getArmorModel( EntityLivingBase entityLiving, ItemStack itemStack, EntityEquipmentSlot slot, ModelBiped _default)`
- `public static java.lang.String fixDomain(java.lang.String base, java.lang.String complex)`
- `public static boolean postMouseEvent()`
- `public static float getOffsetFOV( EntityPlayer entity, float fov)`
- `public static float getFOVModifier( EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float fov)`
- `public static int getSkyBlendColour( World world, BlockPos center)`
- `public static java.lang.String renderMainMenu( GuiMainMenu gui, FontRenderer font, int width, int height, java.lang.String splashText)`
- `public static void mainMenuMouseClick(int mouseX, int mouseY, int mouseButton, FontRenderer font, int width)`
- `public static ISound playSound( SoundManager manager, ISound sound)`
- `public static int getWorldRenderPass()`
- `public static void drawScreen( GuiScreen screen, int mouseX, int mouseY, float partialTicks)`
- `public static float getFogDensity( EntityRenderer renderer, Entity entity, IBlockState state, float partial, float density)`
- `public static void onFogRender( EntityRenderer renderer, Entity entity, IBlockState state, float partial, int mode, float distance)`
- `public static void onModelBake( ModelManager modelManager, IRegistry < ModelResourceLocation , IBakedModel > modelRegistry, ModelLoader modelLoader)`
- `public static javax.vecmath.Matrix4f getMatrix( ItemTransformVec3f transform)`
- `public static IBakedModel handleCameraTransforms( IBakedModel model, ItemCameraTransforms.TransformType cameraTransformType, boolean leftHandHackery)`
- `public static void multiplyCurrentGlMatrix(javax.vecmath.Matrix4f matrix)`
- `public static void preDraw( VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `public static void postDraw( VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `public static void transform(org.lwjgl.util.vector.Vector3f vec, javax.vecmath.Matrix4f m)`
- `public static javax.vecmath.Matrix4f getMatrix( ModelRotation modelRotation)`
- `public static void putQuadColor( VertexBuffer renderer, BakedQuad quad, int color)`
- `public static void renderTileItem( Item item, int metadata)`
- `@Deprecated public static void registerTESRItemStack( Item item, int metadata, java.lang.Class<? extends TileEntity > TileClass)`
- `public static void fillNormal(int[] faceData, EnumFacing facing)`
- `public static com.google.common.base.Optional< TRSRTransformation > applyTransform( ItemTransformVec3f transform, com.google.common.base.Optional<? extends IModelPart > part)`
- `public static com.google.common.base.Optional< TRSRTransformation > applyTransform(javax.vecmath.Matrix4f matrix, com.google.common.base.Optional<? extends IModelPart > part)`
- `public static void loadEntityShader( Entity entity, EntityRenderer entityRenderer)`
- `public static IBakedModel getDamageModel( IBakedModel ibakedmodel, TextureAtlasSprite texture, IBlockState state, IBlockAccess world, BlockPos pos)`
- `public static boolean shouldCauseReequipAnimation(@Nonnull ItemStack from, @Nonnull ItemStack to, int slot)`
- `public static boolean shouldCauseBlockBreakReset(@Nonnull ItemStack from, @Nonnull ItemStack to)`
- `public static BlockFaceUV applyUVLock( BlockFaceUV blockFaceUV, EnumFacing originalSide, ITransformation rotation)`
- `public static RenderGameOverlayEvent.BossInfo bossBarRenderPre( ScaledResolution res, BossInfoLerping bossInfo, int x, int y, int increment)`
- `public static void bossBarRenderPost( ScaledResolution res)`
- `public static ScreenshotEvent onScreenshot(java.awt.image.BufferedImage image, java.io.File screenshotFile)`

## Description

internal, relies on fixed format of FaceBakery
