---
title: "StructureVillagePieces.Village"
description: ""
package: "net/minecraft/world/gen/structure"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/gen/structure/StructureVillagePieces.Village.html"
sourceType: javadoc
---

# StructureVillagePieces.Village

## Constructors

- `public Village()`
- `protected Village( StructureVillagePieces.Start start, int type)`

## Methods

- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound)`
- `protected StructureComponent getNextComponentNN( StructureVillagePieces.Start start, java.util.List< StructureComponent > structureComponents, java.util.Random rand, int p_74891_4_, int p_74891_5_)`
- `protected StructureComponent getNextComponentPP( StructureVillagePieces.Start start, java.util.List< StructureComponent > structureComponents, java.util.Random rand, int p_74894_4_, int p_74894_5_)`
- `protected int getAverageGroundLevel( World worldIn, StructureBoundingBox structurebb)`
- `protected static boolean canVillageGoDeeper( StructureBoundingBox structurebb)`
- `protected void spawnVillagers( World worldIn, StructureBoundingBox structurebb, int x, int y, int z, int count)`
- `protected int chooseProfession(int villagersSpawnedIn, int currentVillagerProfession)`
- `protected IBlockState getBiomeSpecificBlockState( IBlockState blockstateIn)`
- `protected void setBlockState( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void fillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected void replaceAirAndLiquidDownwards( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void setIsDesertVillage(boolean isInDesert)`
