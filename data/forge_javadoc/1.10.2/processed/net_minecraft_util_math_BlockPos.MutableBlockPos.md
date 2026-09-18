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
- `public BlockPos.MutableBlockPos setPos(double xIn, double yIn, double zIn)`
- `public BlockPos.MutableBlockPos setPos( Entity entityIn)`
- `public BlockPos.MutableBlockPos setPos( Vec3i vec)`
- `public BlockPos.MutableBlockPos move( EnumFacing facing)`
- `public BlockPos.MutableBlockPos move( EnumFacing facing, int p_189534_2_)`
- `public void setY(int yIn)`
- `public BlockPos toImmutable()`