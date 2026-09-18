# BlockPos.MutableBlockPos

## Constructors

- `public MutableBlockPos()`
- `public MutableBlockPos( BlockPos pos)`
- `public MutableBlockPos(int x_, int y_, int z_)`

## Methods

- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public BlockPos.MutableBlockPos setPos(int xIn, int yIn, int zIn)`
- `public BlockPos.MutableBlockPos setPos(double p_189532_1_, double p_189532_3_, double p_189532_5_)`
- `public BlockPos.MutableBlockPos setPos( Entity p_189535_1_)`
- `public BlockPos.MutableBlockPos setPos( Vec3i p_189533_1_)`
- `public BlockPos.MutableBlockPos move( EnumFacing p_189536_1_)`
- `public BlockPos.MutableBlockPos move( EnumFacing p_189534_1_, int p_189534_2_)`
- `public void setY(int yIn)`
- `public BlockPos toImmutable()`