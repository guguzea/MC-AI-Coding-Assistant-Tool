# RenderGlobal

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldAccess, IResourceManagerReloadListener
```

## Constructors

- `RenderGlobal(Minecraft mcIn)`

## Methods

- `void broadcastSound(int p_180440_1_, BlockPos p_180440_2_, int p_180440_3_)`
- `void createBindEntityOutlineFbs(int p_72720_1_, int p_72720_2_)`
- `void deleteAllDisplayLists()` — Deletes all display lists
- `void drawBlockDamageTexture(Tessellator tessellatorIn, WorldRenderer worldRendererIn, Entity entityIn, float partialTicks)`
- `static void drawOutlinedBoundingBox(AxisAlignedBB p_181563_0_, int p_181563_1_, int p_181563_2_, int p_181563_3_, int p_181563_4_)`
- `static void drawSelectionBoundingBox(AxisAlignedBB p_181561_0_)`
- `void drawSelectionBox(EntityPlayer player, MovingObjectPosition movingObjectPositionIn, int p_72731_3_, float partialTicks)` — Draws the selection box for the player.
- `java.lang.String getDebugInfoEntities()` — Gets the entities info for use on the Debug screen
- `java.lang.String getDebugInfoRenders()` — Gets the render info for use on the Debug screen
- `protected Vector3f getViewVector(Entity entityIn, double partialTicks)`
- `boolean hasCloudFog(double x, double y, double z, float partialTicks)` — Checks if the given position is to be rendered with cloud fog
- `protected boolean isRenderEntityOutlines()`
- `void loadRenderers()` — Loads all the renderers and sets up the basic settings usage
- `void makeEntityOutlineShader()` — Creates the entity outline shader to be stored in RenderGlobal.entityOutlineShader
- `void markBlockForUpdate(BlockPos pos)`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)` — On the client, re-renders all blocks in this range, inclusive.
- `void notifyLightSet(BlockPos pos)`
- `void onEntityAdded(Entity entityIn)` — Called on all IWorldAccesses when an entity is created or loaded.
- `void onEntityRemoved(Entity entityIn)` — Called on all IWorldAccesses when an entity is unloaded or destroyed.
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void playAuxSFX(EntityPlayer player, int sfxType, BlockPos blockPosIn, int p_180439_4_)`
- `void playRecord(java.lang.String recordName, BlockPos blockPosIn)`
- `void playSound(java.lang.String soundName, double x, double y, double z, float volume, float pitch)` — Plays the specified sound.
- `void playSoundToNearExcept(EntityPlayer except, java.lang.String soundName, double x, double y, double z, float volume, float pitch)` — Plays sound to all near players except the player reference given
- `int renderBlockLayer(EnumWorldBlockLayer blockLayerIn, double partialTicks, int pass, Entity entityIn)`
- `void renderClouds(float partialTicks, int pass)`
- `void renderEntities(Entity renderViewEntity, ICamera camera, float partialTicks)`
- `void renderEntityOutlineFramebuffer()`
- `void renderSky(float partialTicks, int pass)`
- `void renderWorldBorder(Entity p_180449_1_, float partialTicks)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `void setDisplayListEntitiesDirty()`
- `void setupTerrain(Entity viewEntity, double partialTicks, ICamera camera, int frameCount, boolean playerSpectator)`
- `void setWorldAndLoadRenderers(WorldClient worldClientIn)` — set null to clear
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_180442_15_)`
- `protected void stopChunkUpdates()`
- `void updateChunks(long finishTimeNano)`
- `void updateClouds()`
- `void updateTileEntities(java.util.Collection<TileEntity> p_181023_1_, java.util.Collection<TileEntity> p_181023_2_)`