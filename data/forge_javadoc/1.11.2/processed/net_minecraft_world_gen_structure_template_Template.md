# Template

## Class signature

```java
public class Template extends java.lang.Object
```

## Constructors

- `public Template()`

## Methods

- `public BlockPos getSize()`
- `public void setAuthor(java.lang.String authorIn)`
- `public java.lang.String getAuthor()`
- `public void takeBlocksFromWorld( World worldIn, BlockPos startPos, BlockPos endPos, boolean takeEntities, @Nullable Block toIgnore)`
- `public java.util.Map< BlockPos ,java.lang.String> getDataBlocks( BlockPos pos, PlacementSettings placementIn)`
- `public BlockPos calculateConnectedPos( PlacementSettings placementIn, BlockPos p_186262_2_, PlacementSettings p_186262_3_, BlockPos p_186262_4_)`
- `public static BlockPos transformedBlockPos( PlacementSettings placementIn, BlockPos p_186266_1_)`
- `public void addBlocksToWorldChunk( World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `public void addBlocksToWorld( World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `public void addBlocksToWorld( World worldIn, BlockPos pos, PlacementSettings placementIn, int flags)`
- `public void addBlocksToWorld( World p_189960_1_, BlockPos p_189960_2_, @Nullable ITemplateProcessor p_189960_3_, PlacementSettings p_189960_4_, int p_189960_5_)`
- `public BlockPos transformedSize( Rotation rotationIn)`
- `public BlockPos getZeroPositionWithTransform( BlockPos p_189961_1_, Mirror p_189961_2_, Rotation p_189961_3_)`
- `public static BlockPos getZeroPositionWithTransform( BlockPos p_191157_0_, Mirror p_191157_1_, Rotation p_191157_2_, int p_191157_3_, int p_191157_4_)`
- `public static void registerFixes( DataFixer fixer)`
- `public NBTTagCompound writeToNBT( NBTTagCompound nbt)`
- `public void read( NBTTagCompound compound)`