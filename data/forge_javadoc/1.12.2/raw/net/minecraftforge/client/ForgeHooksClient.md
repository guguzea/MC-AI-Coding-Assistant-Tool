---
title: "ForgeHooksClient"
description: "public class ForgeHooksClient extends java.lang.Object"
package: "net/minecraftforge/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/ForgeHooksClient.html"
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

- `static java.util.Optional<TRSRTransformation> applyTransform(ItemTransformVec3f transform, java.util.Optional<? extends IModelPart> part)`
- `static java.util.Optional<TRSRTransformation> applyTransform(Matrix4f matrix, java.util.Optional<? extends IModelPart> part)`
- `static java.util.Optional<TRSRTransformation> applyTransform(ModelRotation rotation, java.util.Optional<? extends IModelPart> part)`
- `static BlockFaceUV applyUVLock(BlockFaceUV blockFaceUV, EnumFacing originalSide, ITransformation rotation)`
- `static void bossBarRenderPost(ScaledResolution res)`
- `static RenderGameOverlayEvent.BossInfo bossBarRenderPre(ScaledResolution res, BossInfoClient bossInfo, int x, int y, int increment)`
- `static void dispatchRenderLast(RenderGlobal context, float partialTicks)`
- `static void drawScreen(GuiScreen screen, int mouseX, int mouseY, float partialTicks)`
- `static void fillNormal(int[] faceData, EnumFacing facing)` — internal, relies on fixed format of FaceBakery
- `static java.lang.String fixDomain(java.lang.String base, java.lang.String complex)`
- `static ModelBiped getArmorModel(EntityLivingBase entityLiving, ItemStack itemStack, EntityEquipmentSlot slot, ModelBiped _default)`
- `static java.lang.String getArmorTexture(Entity entity, ItemStack armor, java.lang.String _default, EntityEquipmentSlot slot, java.lang.String type)`
- `static IBakedModel getDamageModel(IBakedModel ibakedmodel, TextureAtlasSprite texture, IBlockState state, IBlockAccess world, BlockPos pos)`
- `static float getFogDensity(EntityRenderer renderer, Entity entity, IBlockState state, float partial, float density)`
- `static float getFOVModifier(EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float fov)`
- `static java.lang.String getHorseArmorTexture(EntityHorse horse, ItemStack armorStack)`
- `static Matrix4f getMatrix(ModelRotation modelRotation)`
- `static float getOffsetFOV(EntityPlayer entity, float fov)`
- `static int getSkyBlendColour(World world, BlockPos center)`
- `static int getWorldRenderPass()`
- `static IBakedModel handleCameraTransforms(IBakedModel model, ItemCameraTransforms.TransformType cameraTransformType, boolean leftHandHackery)`
- `static<any> handlePerspective(IBakedModel model, ItemCameraTransforms.TransformType type)`
- `static void invalidateLog4jThreadCache()`
- `static void loadEntityShader(Entity entity, EntityRenderer entityRenderer)`
- `static void multiplyCurrentGlMatrix(Matrix4f matrix)`
- `static void onBlockColorsInit(BlockColors blockColors)`
- `static boolean onDrawBlockHighlight(RenderGlobal context, EntityPlayer player, RayTraceResult target, int subID, float partialTicks)`
- `static void onFogRender(EntityRenderer renderer, Entity entity, IBlockState state, float partial, int mode, float distance)`
- `static void onInputUpdate(EntityPlayer player, MovementInput movementInput)`
- `static void onItemColorsInit(ItemColors itemColors, BlockColors blockColors)`
- `static void onModelBake(ModelManager modelManager, IRegistry<ModelResourceLocation, IBakedModel> modelRegistry, ModelLoader modelLoader)`
- `static ScreenshotEvent onScreenshot(java.awt.image.BufferedImage image, java.io.File screenshotFile)`
- `static void onTextureStitchedPost(TextureMap map)`
- `static void onTextureStitchedPre(TextureMap map)`
- `static void orientBedCamera(IBlockAccess world, BlockPos pos, IBlockState state, Entity entity)`
- `static ISound playSound(SoundManager manager, ISound sound)`
- `static void postDraw(VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `static boolean postMouseEvent()`
- `static void preDraw(VertexFormatElement.EnumUsage attrType, VertexFormat format, int element, int stride, java.nio.ByteBuffer buffer)`
- `static void putQuadColor(BufferBuilder renderer, BakedQuad quad, int color)`
- `@Deprecated static void registerTESRItemStack(Item item, int metadata, java.lang.Class<? extends TileEntity> TileClass)` — Deprecated. Will be removed as soon as possible. See Item.getTileEntityItemStackRenderer() .
- `static boolean renderFirstPersonHand(RenderGlobal context, float partialTicks, int renderPass)`
- `static void renderLitItem(RenderItem ri, IBakedModel model, int color, ItemStack stack)`
- `static java.lang.String renderMainMenu(GuiMainMenu gui, FontRenderer font, int width, int height, java.lang.String splashText)`
- `static boolean renderSpecificFirstPersonHand(EnumHand hand, float partialTicks, float interpPitch, float swingProgress, float equipProgress, ItemStack stack)`
- `static void renderTileItem(Item item, int metadata)`
- `static void setRenderLayer(BlockRenderLayer layer)`
- `static void setRenderPass(int pass)`
- `static boolean shouldCauseBlockBreakReset(ItemStack from, ItemStack to)`
- `static boolean shouldCauseReequipAnimation(ItemStack from, ItemStack to, int slot)`
- `static boolean shouldUseVanillaReloadableListener(IResourceManagerReloadListener listener)`
- `static void transform(org.lwjgl.util.vector.Vector3f vec, Matrix4f m)`
