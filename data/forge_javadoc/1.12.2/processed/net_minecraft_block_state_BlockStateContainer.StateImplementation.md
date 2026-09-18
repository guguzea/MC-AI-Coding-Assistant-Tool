# BlockStateContainer.StateImplementation

## Constructors

- `protected StateImplementation( Block blockIn, <any> propertiesIn)`
- `protected StateImplementation( Block blockIn, <any> propertiesIn, <any> propertyValueTable)`

## Methods

- `public java.util.Collection< IProperty <?>> getPropertyKeys()`
- `public <T extends java.lang.Comparable<T>> T getValue( IProperty <T> property)`
- `public <T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `public <any> getProperties()`
- `public Block getBlock()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void buildPropertyValueTable(java.util.Map<java.util.Map< IProperty <?>,java.lang.Comparable<?>>, BlockStateContainer.StateImplementation > map)`
- `public Material getMaterial()`
- `public boolean isFullBlock()`
- `public boolean canEntitySpawn( Entity entityIn)`
- `public int getLightOpacity()`
- `public int getLightValue()`
- `public boolean isTranslucent()`
- `public boolean useNeighborBrightness()`
- `public MapColor getMapColor( IBlockAccess p_185909_1_, BlockPos p_185909_2_)`
- `public IBlockState withRotation( Rotation rot)`
- `public IBlockState withMirror( Mirror mirrorIn)`
- `public boolean isFullCube()`
- `public boolean hasCustomBreakingProgress()`
- `public EnumBlockRenderType getRenderType()`
- `public int getPackedLightmapCoords( IBlockAccess source, BlockPos pos)`
- `public float getAmbientOcclusionLightValue()`
- `public boolean isBlockNormalCube()`
- `public boolean isNormalCube()`
- `public boolean canProvidePower()`
- `public int getWeakPower( IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public float getBlockHardness( World worldIn, BlockPos pos)`
- `public float getPlayerRelativeBlockHardness( EntityPlayer player, World worldIn, BlockPos pos)`
- `public int getStrongPower( IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public EnumPushReaction getMobilityFlag()`
- `public IBlockState getActualState( IBlockAccess blockAccess, BlockPos pos)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockAccess blockAccess, BlockPos pos, EnumFacing facing)`
- `public boolean isOpaqueCube()`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockAccess worldIn, BlockPos pos)`
- `public void addCollisionBoxToList( World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, Entity entityIn, boolean p_185908_6_)`
- `public AxisAlignedBB getBoundingBox( IBlockAccess blockAccess, BlockPos pos)`
- `public RayTraceResult collisionRayTrace( World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `public boolean isTopSolid()`
- `public Vec3d getOffset( IBlockAccess access, BlockPos pos)`
- `public boolean onBlockEventReceived( World worldIn, BlockPos pos, int id, int param)`
- `public void neighborChanged( World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public boolean causesSuffocation()`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, BlockPos pos, EnumFacing facing)`
- `public <any> getPropertyValueTable()`
- `public int getLightOpacity( IBlockAccess world, BlockPos pos)`
- `public int getLightValue( IBlockAccess world, BlockPos pos)`
- `public boolean isSideSolid( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `public boolean doesSideBlockChestOpening( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `public boolean doesSideBlockRendering( IBlockAccess world, BlockPos pos, EnumFacing side)`