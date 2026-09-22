---
title: "RenderGlobal"
description: "public class RenderGlobal extends java.lang.Object implements IWorldAccess"
package: "net/minecraft/client/renderer"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/renderer/RenderGlobal.html"
sourceType: javadoc
---

# RenderGlobal

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldAccess
```

## Constructors

- `RenderGlobal(Minecraft p_i1249_1_)`

## Methods

- `void broadcastSound(int p_82746_1_, int p_82746_2_, int p_82746_3_, int p_82746_4_, int p_82746_5_)`
- `void clipRenderersByFrustum(ICamera p_72729_1_, float p_72729_2_)`
- `void deleteAllDisplayLists()`
- `void destroyBlockPartially(int p_147587_1_, int p_147587_2_, int p_147587_3_, int p_147587_4_, int p_147587_5_)`
- `EntityFX doSpawnParticle(java.lang.String p_72726_1_, double p_72726_2_, double p_72726_4_, double p_72726_6_, double p_72726_8_, double p_72726_10_, double p_72726_12_)`
- `void drawBlockDamageTexture(Tessellator p_72717_1_, EntityPlayer p_72717_2_, float p_72717_3_)`
- `static void drawOutlinedBoundingBox(AxisAlignedBB p_147590_0_, int p_147590_1_)`
- `void drawSelectionBox(EntityPlayer p_72731_1_, MovingObjectPosition p_72731_2_, int p_72731_3_, float p_72731_4_)`
- `java.lang.String getDebugInfoEntities()`
- `java.lang.String getDebugInfoRenders()`
- `boolean hasCloudFog(double p_72721_1_, double p_72721_3_, double p_72721_5_, float p_72721_7_)`
- `void loadRenderers()`
- `void markBlockForRenderUpdate(int p_147588_1_, int p_147588_2_, int p_147588_3_)`
- `void markBlockForUpdate(int p_147586_1_, int p_147586_2_, int p_147586_3_)`
- `void markBlockRangeForRenderUpdate(int p_147585_1_, int p_147585_2_, int p_147585_3_, int p_147585_4_, int p_147585_5_, int p_147585_6_)`
- `void markBlocksForUpdate(int p_72725_1_, int p_72725_2_, int p_72725_3_, int p_72725_4_, int p_72725_5_, int p_72725_6_)`
- `void onEntityCreate(Entity p_72703_1_)`
- `void onEntityDestroy(Entity p_72709_1_)`
- `void onStaticEntitiesChanged()`
- `void playAuxSFX(EntityPlayer p_72706_1_, int p_72706_2_, int p_72706_3_, int p_72706_4_, int p_72706_5_, int p_72706_6_)`
- `void playRecord(java.lang.String p_72702_1_, int p_72702_2_, int p_72702_3_, int p_72702_4_)`
- `void playSound(java.lang.String p_72704_1_, double p_72704_2_, double p_72704_4_, double p_72704_6_, float p_72704_8_, float p_72704_9_)`
- `void playSoundToNearExcept(EntityPlayer p_85102_1_, java.lang.String p_85102_2_, double p_85102_3_, double p_85102_5_, double p_85102_7_, float p_85102_9_, float p_85102_10_)`
- `void rebuildDisplayListEntities()`
- `void registerDestroyBlockIcons(IIconRegister p_94140_1_)`
- `void renderAllRenderLists(int p_72733_1_, double p_72733_2_)`
- `void renderClouds(float p_72718_1_)`
- `void renderCloudsFancy(float p_72736_1_)`
- `void renderEntities(EntityLivingBase p_147589_1_, ICamera p_147589_2_, float p_147589_3_)`
- `void renderSky(float p_72714_1_)`
- `void setWorldAndLoadRenderers(WorldClient p_72732_1_)`
- `int sortAndRender(EntityLivingBase p_72719_1_, int p_72719_2_, double p_72719_3_)`
- `void spawnParticle(java.lang.String p_72708_1_, double p_72708_2_, double p_72708_4_, double p_72708_6_, double p_72708_8_, double p_72708_10_, double p_72708_12_)`
- `void updateClouds()`
- `boolean updateRenderers(EntityLivingBase p_72716_1_, boolean p_72716_2_)`

## Fields

- `java.util.List tileEntities`
