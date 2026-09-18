---
title: "RenderGlobal"
description: "Deletes all display lists"
package: "net/minecraft/client/renderer"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/RenderGlobal.html"
sourceType: javadoc
---

# RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldAccess , IResourceManagerReloadListener
```

## Constructors

- `public RenderGlobal( Minecraft mcIn)`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public void makeEntityOutlineShader()`
- `public void renderEntityOutlineFramebuffer()`
- `protected boolean isRenderEntityOutlines()`
- `public void setWorldAndLoadRenderers( WorldClient worldClientIn)`
- `public void loadRenderers()`
- `protected void stopChunkUpdates()`
- `public void createBindEntityOutlineFbs(int p_72720_1_, int p_72720_2_)`
- `public void renderEntities( Entity renderViewEntity, ICamera camera, float partialTicks)`
- `public java.lang.String getDebugInfoRenders()`
- `public java.lang.String getDebugInfoEntities()`
- `public void setupTerrain( Entity viewEntity, double partialTicks, ICamera camera, int frameCount, boolean playerSpectator)`
- `protected Vector3f getViewVector( Entity entityIn, double partialTicks)`
- `public int renderBlockLayer( EnumWorldBlockLayer blockLayerIn, double partialTicks, int pass, Entity entityIn)`
- `public void updateClouds()`
- `public void renderSky(float partialTicks, int pass)`
- `public void renderClouds(float partialTicks, int pass)`
- `public boolean hasCloudFog(double x, double y, double z, float partialTicks)`
- `public void updateChunks(long finishTimeNano)`
- `public void renderWorldBorder( Entity p_180449_1_, float partialTicks)`
- `public void drawBlockDamageTexture( Tessellator tessellatorIn, WorldRenderer worldRendererIn, Entity entityIn, float partialTicks)`
- `public void drawSelectionBox( EntityPlayer player, MovingObjectPosition movingObjectPositionIn, int p_72731_3_, float partialTicks)`
- `public static void drawSelectionBoundingBox( AxisAlignedBB p_181561_0_)`
- `public static void drawOutlinedBoundingBox( AxisAlignedBB p_181563_0_, int p_181563_1_, int p_181563_2_, int p_181563_3_, int p_181563_4_)`
- `public void markBlockForUpdate( BlockPos pos)`
- `public void notifyLightSet( BlockPos pos)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void playRecord(java.lang.String recordName, BlockPos blockPosIn)`
- `public void playSound(java.lang.String soundName, double x, double y, double z, float volume, float pitch)`
- `public void playSoundToNearExcept( EntityPlayer except, java.lang.String soundName, double x, double y, double z, float volume, float pitch)`
- `public void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_180442_15_)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void deleteAllDisplayLists()`
- `public void broadcastSound(int p_180440_1_, BlockPos p_180440_2_, int p_180440_3_)`
- `public void playAuxSFX( EntityPlayer player, int sfxType, BlockPos blockPosIn, int p_180439_4_)`
- `public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `public void setDisplayListEntitiesDirty()`
- `public void updateTileEntities(java.util.Collection< TileEntity > p_181023_1_, java.util.Collection< TileEntity > p_181023_2_)`

## Description

Deletes all display lists
