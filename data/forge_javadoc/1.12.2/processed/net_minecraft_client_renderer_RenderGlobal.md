# RenderGlobal

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldEventListener, IResourceManagerReloadListener
```

## Constructors

- `RenderGlobal(Minecraft mcIn)`

## Methods

- `static void addChainedFilledBoxVertices(BufferBuilder builder, double p_189693_1_, double p_189693_3_, double p_189693_5_, double p_189693_7_, double p_189693_9_, double p_189693_11_, float red, float green, float blue, float alpha)`
- `void broadcastSound(int soundID, BlockPos pos, int data)`
- `void createBindEntityOutlineFbs(int width, int height)`
- `void deleteAllDisplayLists()`
- `void drawBlockDamageTexture(Tessellator tessellatorIn, BufferBuilder bufferBuilderIn, Entity entityIn, float partialTicks)`
- `static void drawBoundingBox(BufferBuilder buffer, double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `static void drawBoundingBox(double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `static void drawSelectionBoundingBox(AxisAlignedBB box, float red, float green, float blue, float alpha)`
- `void drawSelectionBox(EntityPlayer player, RayTraceResult movingObjectPositionIn, int execute, float partialTicks)`
- `java.lang.String getDebugInfoEntities()`
- `java.lang.String getDebugInfoRenders()`
- `protected int getRenderedChunks()`
- `protected Vector3f getViewVector(Entity entityIn, double partialTicks)`
- `boolean hasCloudFog(double x, double y, double z, float partialTicks)`
- `boolean hasNoChunkUpdates()`
- `protected boolean isRenderEntityOutlines()`
- `void loadRenderers()`
- `void makeEntityOutlineShader()`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `void notifyBlockUpdate(World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `void notifyLightSet(BlockPos pos)`
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void playEvent(EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `void playRecord(SoundEvent soundIn, BlockPos pos)`
- `void playSoundToAllNearExcept(EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `int renderBlockLayer(BlockRenderLayer blockLayerIn, double partialTicks, int pass, Entity entityIn)`
- `void renderClouds(float partialTicks, int pass, double p_180447_3_, double p_180447_5_, double p_180447_7_)`
- `void renderEntities(Entity renderViewEntity, ICamera camera, float partialTicks)`
- `void renderEntityOutlineFramebuffer()`
- `static void renderFilledBox(AxisAlignedBB aabb, float red, float green, float blue, float alpha)`
- `static void renderFilledBox(double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `void renderSky(float partialTicks, int pass)`
- `void renderWorldBorder(Entity entityIn, float partialTicks)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `void setDisplayListEntitiesDirty()`
- `void setupTerrain(Entity viewEntity, double partialTicks, ICamera camera, int frameCount, boolean playerSpectator)`
- `void setWorldAndLoadRenderers(WorldClient worldClientIn)`
- `void spawnParticle(int id, boolean ignoreRange, boolean p_190570_3_, double x, double y, double z, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `protected void stopChunkUpdates()`
- `void updateChunks(long finishTimeNano)`
- `void updateClouds()`
- `void updateTileEntities(java.util.Collection<TileEntity> tileEntitiesToRemove, java.util.Collection<TileEntity> tileEntitiesToAdd)`