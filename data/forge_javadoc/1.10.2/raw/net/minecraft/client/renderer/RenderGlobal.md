---
title: "RenderGlobal"
description: "public class RenderGlobal extends java.lang.Object implements IWorldEventListener , IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/RenderGlobal.html"
sourceType: javadoc
---

# RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldEventListener , IResourceManagerReloadListener
```

## Constructors

- `public RenderGlobal( Minecraft mcIn)`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public void makeEntityOutlineShader()`
- `public void renderEntityOutlineFramebuffer()`
- `protected boolean isRenderEntityOutlines()`
- `public void setWorldAndLoadRenderers(@Nullable WorldClient worldClientIn)`
- `public void loadRenderers()`
- `protected void stopChunkUpdates()`
- `public void createBindEntityOutlineFbs(int width, int height)`
- `public void renderEntities( Entity renderViewEntity, ICamera camera, float partialTicks)`
- `public java.lang.String getDebugInfoRenders()`
- `protected int getRenderedChunks()`
- `public java.lang.String getDebugInfoEntities()`
- `public void setupTerrain( Entity viewEntity, double partialTicks, ICamera camera, int frameCount, boolean playerSpectator)`
- `protected org.lwjgl.util.vector.Vector3f getViewVector( Entity entityIn, double partialTicks)`
- `public int renderBlockLayer( BlockRenderLayer blockLayerIn, double partialTicks, int pass, Entity entityIn)`
- `public void updateClouds()`
- `public void renderSky(float partialTicks, int pass)`
- `public void renderClouds(float partialTicks, int pass)`
- `public boolean hasCloudFog(double x, double y, double z, float partialTicks)`
- `public void updateChunks(long finishTimeNano)`
- `public void renderWorldBorder( Entity entityIn, float partialTicks)`
- `public void drawBlockDamageTexture( Tessellator tessellatorIn, VertexBuffer worldRendererIn, Entity entityIn, float partialTicks)`
- `public void drawSelectionBox( EntityPlayer player, RayTraceResult movingObjectPositionIn, int execute, float partialTicks)`
- `public static void drawSelectionBoundingBox( AxisAlignedBB box, float red, float green, float blue, float alpha)`
- `public static void drawBoundingBox(double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `public static void drawBoundingBox( VertexBuffer buffer, double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `public static void renderFilledBox( AxisAlignedBB p_189696_0_, float p_189696_1_, float p_189696_2_, float p_189696_3_, float p_189696_4_)`
- `public static void renderFilledBox(double p_189695_0_, double p_189695_2_, double p_189695_4_, double p_189695_6_, double p_189695_8_, double p_189695_10_, float p_189695_12_, float p_189695_13_, float p_189695_14_, float p_189695_15_)`
- `public static void addChainedFilledBoxVertices( VertexBuffer p_189693_0_, double p_189693_1_, double p_189693_3_, double p_189693_5_, double p_189693_7_, double p_189693_9_, double p_189693_11_, float p_189693_13_, float p_189693_14_, float p_189693_15_, float p_189693_16_)`
- `public void notifyBlockUpdate( World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `public void notifyLightSet( BlockPos pos)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void playRecord(@Nullable SoundEvent soundIn, BlockPos pos)`
- `public void playSoundToAllNearExcept(@Nullable EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `public void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void deleteAllDisplayLists()`
- `public void broadcastSound(int soundID, BlockPos pos, int data)`
- `public void playEvent( EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `public boolean hasNoChunkUpdates()`
- `public void setDisplayListEntitiesDirty()`
- `public void updateTileEntities(java.util.Collection< TileEntity > tileEntitiesToRemove, java.util.Collection< TileEntity > tileEntitiesToAdd)`
