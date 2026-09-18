# StructureVillagePieces.Village

## Constructors

- `public Village()`
- `protected Village( StructureVillagePieces.Start start, int type)`

## Methods

- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound)`
- `protected StructureComponent getNextComponentNN( StructureVillagePieces.Start start, java.util.List< StructureComponent > p_74891_2_, java.util.Random rand, int p_74891_4_, int p_74891_5_)`
- `protected StructureComponent getNextComponentPP( StructureVillagePieces.Start start, java.util.List< StructureComponent > p_74894_2_, java.util.Random rand, int p_74894_4_, int p_74894_5_)`
- `protected int getAverageGroundLevel( World worldIn, StructureBoundingBox p_74889_2_)`
- `protected static boolean canVillageGoDeeper( StructureBoundingBox p_74895_0_)`
- `protected void spawnVillagers( World worldIn, StructureBoundingBox p_74893_2_, int p_74893_3_, int p_74893_4_, int p_74893_5_, int p_74893_6_)`
- `protected int func_180779_c(int p_180779_1_, int p_180779_2_)`
- `protected IBlockState func_175847_a( IBlockState p_175847_1_)`
- `protected void setBlockState( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void fillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected void replaceAirAndLiquidDownwards( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void func_175846_a(boolean p_175846_1_)`

## Description

Fill the given area with the selected blocks