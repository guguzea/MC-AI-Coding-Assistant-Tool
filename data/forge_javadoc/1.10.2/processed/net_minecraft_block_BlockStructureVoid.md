# BlockStructureVoid

## Class signature

```java
public class BlockStructureVoid extends Block
```

## Constructors

- `protected BlockStructureVoid()`

## Methods

- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public float getAmbientOcclusionLightValue( IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`