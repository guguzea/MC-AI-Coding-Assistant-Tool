# EmptyChunk

## Class signature

```java
public class EmptyChunk extends Chunk
```

## Constructors

- `public EmptyChunk( World worldIn, int x, int z)`

## Methods

- `public boolean isAtLocation(int x, int z)`
- `public int getHeightValue(int x, int z)`
- `public void generateHeightMap()`
- `public void generateSkylightMap()`
- `public IBlockState getBlockState( BlockPos pos)`
- `public int getBlockLightOpacity( BlockPos pos)`
- `public int getLightFor( EnumSkyBlock p_177413_1_, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock p_177431_1_, BlockPos pos, int value)`
- `public int getLightSubtracted( BlockPos pos, int amount)`
- `public void addEntity( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityAtIndex( Entity entityIn, int index)`
- `public boolean canSeeSky( BlockPos pos)`
- `@Nullable public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `public void addTileEntity( TileEntity tileEntityIn)`
- `public void addTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void onChunkLoad()`
- `public void onChunkUnload()`
- `public void setChunkModified()`
- `public void getEntitiesWithinAABBForEntity(@Nullable Entity entityIn, AxisAlignedBB aabb, java.util.List< Entity > listToFill, com.google.common.base.Predicate<? super Entity > p_177414_4_)`
- `public <T extends Entity > void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, com.google.common.base.Predicate<? super T> filter)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long seed)`
- `public boolean isEmpty()`
- `public boolean getAreLevelsEmpty(int startY, int endY)`