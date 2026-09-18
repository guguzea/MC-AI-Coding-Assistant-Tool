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
- `public void setWorldAndLoadRenderers( WorldClient worldClientIn)`
- `public void loadRenderers()`
- `protected void stopChunkUpdates()`
- `public void createBindEntityOutlineFbs(int width, int height)`
- `public void renderEntities( Entity renderViewEntity, ICamera camera, float partialTicks)`
- `public java.lang.String getDebugInfoRenders()`
- `protected int getRenderedChunks()`
- `public java.lang.String getDebugInfoEntities()`
- `public void setupTerrain( Entity viewEntity, double partialTicks, ICamera camera, int frameCount, boolean playerSpectator)`
- `protected Vector3f getViewVector( Entity entityIn, double partialTicks)`
- `public int renderBlockLayer( BlockRenderLayer blockLayerIn, double partialTicks, int pass, Entity entityIn)`
- `public void updateClouds()`
- `public void renderSky(float partialTicks, int pass)`
- `public void renderClouds(float partialTicks, int pass, double p_180447_3_, double p_180447_5_, double p_180447_7_)`
- `public boolean hasCloudFog(double x, double y, double z, float partialTicks)`
- `public void updateChunks(long finishTimeNano)`
- `public void renderWorldBorder( Entity entityIn, float partialTicks)`
- `public void drawBlockDamageTexture( Tessellator tessellatorIn, BufferBuilder bufferBuilderIn, Entity entityIn, float partialTicks)`
- `public void drawSelectionBox( EntityPlayer player, RayTraceResult movingObjectPositionIn, int execute, float partialTicks)`
- `public static void drawSelectionBoundingBox( AxisAlignedBB box, float red, float green, float blue, float alpha)`
- `public static void drawBoundingBox(double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `public static void drawBoundingBox( BufferBuilder buffer, double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `public static void renderFilledBox( AxisAlignedBB aabb, float red, float green, float blue, float alpha)`
- `public static void renderFilledBox(double minX, double minY, double minZ, double maxX, double maxY, double maxZ, float red, float green, float blue, float alpha)`
- `public static void addChainedFilledBoxVertices( BufferBuilder builder, double p_189693_1_, double p_189693_3_, double p_189693_5_, double p_189693_7_, double p_189693_9_, double p_189693_11_, float red, float green, float blue, float alpha)`
- `public void notifyBlockUpdate( World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `public void notifyLightSet( BlockPos pos)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void playRecord( SoundEvent soundIn, BlockPos pos)`
- `public void playSoundToAllNearExcept( EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `public void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void spawnParticle(int id, boolean ignoreRange, boolean p_190570_3_, double x, double y, double z, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void deleteAllDisplayLists()`
- `public void broadcastSound(int soundID, BlockPos pos, int data)`
- `public void playEvent( EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `public boolean hasNoChunkUpdates()`
- `public void setDisplayListEntitiesDirty()`
- `public void updateTileEntities(java.util.Collection< TileEntity > tileEntitiesToRemove, java.util.Collection< TileEntity > tileEntitiesToAdd)`