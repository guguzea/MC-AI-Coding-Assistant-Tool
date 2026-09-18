# StructureVillagePieces.Village

## Constructors

- `public Village()`
- `protected Village( StructureVillagePieces.Start start, int type)`

## Methods

- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `protected StructureComponent getNextComponentNN( StructureVillagePieces.Start start, java.util.List< StructureComponent > structureComponents, java.util.Random rand, int p_74891_4_, int p_74891_5_)`
- `protected StructureComponent getNextComponentPP( StructureVillagePieces.Start start, java.util.List< StructureComponent > structureComponents, java.util.Random rand, int p_74894_4_, int p_74894_5_)`
- `protected int getAverageGroundLevel( World worldIn, StructureBoundingBox structurebb)`
- `protected static boolean canVillageGoDeeper( StructureBoundingBox structurebb)`
- `protected void spawnVillagers( World worldIn, StructureBoundingBox structurebb, int x, int y, int z, int count)`
- `@Deprecated protected int chooseProfession(int villagersSpawnedIn, int currentVillagerProfession)`
- `protected VillagerRegistry.VillagerProfession chooseForgeProfession(int count, VillagerRegistry.VillagerProfession prof)`
- `protected IBlockState getBiomeSpecificBlockState( IBlockState blockstateIn)`
- `protected BlockDoor biomeDoor()`
- `protected void createVillageDoor( World p_189927_1_, StructureBoundingBox p_189927_2_, java.util.Random p_189927_3_, int p_189927_4_, int p_189927_5_, int p_189927_6_, EnumFacing p_189927_7_)`
- `protected void placeTorch( World p_189926_1_, EnumFacing p_189926_2_, int p_189926_3_, int p_189926_4_, int p_189926_5_, StructureBoundingBox p_189926_6_)`
- `protected void replaceAirAndLiquidDownwards( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void setStructureType(int p_189924_1_)`

## Description

Deprecated.