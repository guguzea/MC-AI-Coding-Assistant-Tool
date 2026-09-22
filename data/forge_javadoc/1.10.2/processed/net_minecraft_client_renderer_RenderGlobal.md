# RenderGlobal

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.RenderGlobal

## Class signature

```java
public class RenderGlobal extends java.lang.Object implements IWorldEventListener, IResourceManagerReloadListener
```

## Constructors

- `RenderGlobal(Minecraft mcIn)`

## Methods

- `static void addChainedFilledBoxVertices(VertexBuffer p_189693_0_, double p_189693_1_, double p_189693_3_, double p_189693_5_, double p_189693_7_, double p_189693_9_, double p_189693_11_, float p_189693_13_, float p_189693_14_, float p_189693_15_, float p_189693_16_)`
- `void broadcastSound(int soundID, BlockPos pos, int data)`
- `void createBindEntityOutlineFbs(int width, int height)`
- `void deleteAllDisplayLists()`
- `void drawBlockDamageTexture(Tessellator tessellatorIn, VertexBuffer worldRendererIn, Entity entityIn, float partialTicks)`
- `static void drawBoundingBox(double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `static void drawBoundingBox(VertexBuffer buffer, double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `static void drawSelectionBoundingBox(AxisAlignedBB box, float red, float green, float blue, float alpha)`
- `void drawSelectionBox(EntityPlayer player, RayTraceResult movingObjectPositionIn, int execute, float partialTicks)`
- `java.lang.String getDebugInfoEntities()`
- `java.lang.String getDebugInfoRenders()`
- `protected int getRenderedChunks()`
- `protected org.lwjgl.util.vector.Vector3f getViewVector(Entity entityIn, double partialTicks)`
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
- `void renderClouds(float partialTicks, int pass)`
- `void renderEntities(Entity renderViewEntity, ICamera camera, float partialTicks)`
- `void renderEntityOutlineFramebuffer()`
- `static void renderFilledBox(AxisAlignedBB p_189696_0_, float p_189696_1_, float p_189696_2_, float p_189696_3_, float p_189696_4_)`
- `static void renderFilledBox(double p_189695_0_, double p_189695_2_, double p_189695_4_, double p_189695_6_, double p_189695_8_, double p_189695_10_, float p_189695_12_, float p_189695_13_, float p_189695_14_, float p_189695_15_)`
- `void renderSky(float partialTicks, int pass)`
- `void renderWorldBorder(Entity entityIn, float partialTicks)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `void setDisplayListEntitiesDirty()`
- `void setupTerrain(Entity viewEntity, double partialTicks, ICamera camera, int frameCount, boolean playerSpectator)`
- `void setWorldAndLoadRenderers(WorldClient worldClientIn)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `protected void stopChunkUpdates()`
- `void updateChunks(long finishTimeNano)`
- `void updateClouds()`
- `void updateTileEntities(java.util.Collection<TileEntity> tileEntitiesToRemove, java.util.Collection<TileEntity> tileEntitiesToAdd)`