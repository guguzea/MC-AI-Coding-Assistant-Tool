---
title: "StructureVillagePieces.Village"
description: "public abstract static class StructureVillagePieces.Village extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/gen/structure/StructureVillagePieces.Village.html"
sourceType: javadoc
---

# StructureVillagePieces.Village

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureVillagePieces.Village

## Class signature

```java
public abstract static class StructureVillagePieces.Village extends StructureComponent
```

## Constructors

- `Village()`
- `Village(StructureVillagePieces.Start start, int type)`

## Methods

- `protected static boolean canVillageGoDeeper(StructureBoundingBox structurebb)`
- `protected int chooseProfession(int villagersSpawnedIn, int currentVillagerProfession)`
- `protected void fillWithBlocks(World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected int getAverageGroundLevel(World worldIn, StructureBoundingBox structurebb)`
- `protected IBlockState getBiomeSpecificBlockState(IBlockState blockstateIn)`
- `protected StructureComponent getNextComponentNN(StructureVillagePieces.Start start, java.util.List<StructureComponent> structureComponents, java.util.Random rand, int p_74891_4_, int p_74891_5_)`
- `protected StructureComponent getNextComponentPP(StructureVillagePieces.Start start, java.util.List<StructureComponent> structureComponents, java.util.Random rand, int p_74894_4_, int p_74894_5_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)`
- `protected void replaceAirAndLiquidDownwards(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void setBlockState(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void setIsDesertVillage(boolean isInDesert)`
- `protected void spawnVillagers(World worldIn, StructureBoundingBox structurebb, int x, int y, int z, int count)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected int averageGroundLvl`
- `protected StructureVillagePieces.Start startPiece`
