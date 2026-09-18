# RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldAccess
```

## Constructors

- `public RenderGlobal( Minecraft p_i1249_1_)`

## Methods

- `public void setWorldAndLoadRenderers( WorldClient p_72732_1_)`
- `public void loadRenderers()`
- `public void renderEntities( EntityLivingBase p_147589_1_, ICamera p_147589_2_, float p_147589_3_)`
- `public java.lang.String getDebugInfoRenders()`
- `public java.lang.String getDebugInfoEntities()`
- `public void onStaticEntitiesChanged()`
- `public void rebuildDisplayListEntities()`
- `public int sortAndRender( EntityLivingBase p_72719_1_, int p_72719_2_, double p_72719_3_)`
- `public void renderAllRenderLists(int p_72733_1_, double p_72733_2_)`
- `public void updateClouds()`
- `public void renderSky(float p_72714_1_)`
- `public void renderClouds(float p_72718_1_)`
- `public boolean hasCloudFog(double p_72721_1_, double p_72721_3_, double p_72721_5_, float p_72721_7_)`
- `public void renderCloudsFancy(float p_72736_1_)`
- `public boolean updateRenderers( EntityLivingBase p_72716_1_, boolean p_72716_2_)`
- `public void drawBlockDamageTexture( Tessellator p_72717_1_, EntityPlayer p_72717_2_, float p_72717_3_)`
- `public void drawSelectionBox( EntityPlayer p_72731_1_, MovingObjectPosition p_72731_2_, int p_72731_3_, float p_72731_4_)`
- `public static void drawOutlinedBoundingBox( AxisAlignedBB p_147590_0_, int p_147590_1_)`
- `public void markBlocksForUpdate(int p_72725_1_, int p_72725_2_, int p_72725_3_, int p_72725_4_, int p_72725_5_, int p_72725_6_)`
- `public void markBlockForUpdate(int p_147586_1_, int p_147586_2_, int p_147586_3_)`
- `public void markBlockForRenderUpdate(int p_147588_1_, int p_147588_2_, int p_147588_3_)`
- `public void markBlockRangeForRenderUpdate(int p_147585_1_, int p_147585_2_, int p_147585_3_, int p_147585_4_, int p_147585_5_, int p_147585_6_)`
- `public void clipRenderersByFrustum( ICamera p_72729_1_, float p_72729_2_)`
- `public void playRecord(java.lang.String p_72702_1_, int p_72702_2_, int p_72702_3_, int p_72702_4_)`
- `public void playSound(java.lang.String p_72704_1_, double p_72704_2_, double p_72704_4_, double p_72704_6_, float p_72704_8_, float p_72704_9_)`
- `public void playSoundToNearExcept( EntityPlayer p_85102_1_, java.lang.String p_85102_2_, double p_85102_3_, double p_85102_5_, double p_85102_7_, float p_85102_9_, float p_85102_10_)`
- `public void spawnParticle(java.lang.String p_72708_1_, double p_72708_2_, double p_72708_4_, double p_72708_6_, double p_72708_8_, double p_72708_10_, double p_72708_12_)`
- `public EntityFX doSpawnParticle(java.lang.String p_72726_1_, double p_72726_2_, double p_72726_4_, double p_72726_6_, double p_72726_8_, double p_72726_10_, double p_72726_12_)`
- `public void onEntityCreate( Entity p_72703_1_)`
- `public void onEntityDestroy( Entity p_72709_1_)`
- `public void deleteAllDisplayLists()`
- `public void broadcastSound(int p_82746_1_, int p_82746_2_, int p_82746_3_, int p_82746_4_, int p_82746_5_)`
- `public void playAuxSFX( EntityPlayer p_72706_1_, int p_72706_2_, int p_72706_3_, int p_72706_4_, int p_72706_5_, int p_72706_6_)`
- `public void destroyBlockPartially(int p_147587_1_, int p_147587_2_, int p_147587_3_, int p_147587_4_, int p_147587_5_)`
- `public void registerDestroyBlockIcons( IIconRegister p_94140_1_)`