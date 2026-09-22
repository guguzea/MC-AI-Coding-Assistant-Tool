---
title: "StructureVillagePieces.Village"
description: "public abstract static class StructureVillagePieces.Village extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/structure/StructureVillagePieces.Village.html"
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
- `protected VillagerRegistry.VillagerProfession chooseForgeProfession(int count, VillagerRegistry.VillagerProfession prof)`
- `@Deprecated protected int chooseProfession(int villagersSpawnedIn, int currentVillagerProfession)`
- `protected void func_189924_a(int p_189924_1_)`
- `protected BlockDoor func_189925_i()`
- `protected void func_189926_a(World p_189926_1_, EnumFacing p_189926_2_, int p_189926_3_, int p_189926_4_, int p_189926_5_, StructureBoundingBox p_189926_6_)`
- `protected void func_189927_a(World p_189927_1_, StructureBoundingBox p_189927_2_, java.util.Random p_189927_3_, int p_189927_4_, int p_189927_5_, int p_189927_6_, EnumFacing p_189927_7_)`
- `protected int getAverageGroundLevel(World worldIn, StructureBoundingBox structurebb)`
- `protected IBlockState getBiomeSpecificBlockState(IBlockState blockstateIn)`
- `protected StructureComponent getNextComponentNN(StructureVillagePieces.Start start, java.util.List<StructureComponent> structureComponents, java.util.Random rand, int p_74891_4_, int p_74891_5_)`
- `protected StructureComponent getNextComponentPP(StructureVillagePieces.Start start, java.util.List<StructureComponent> structureComponents, java.util.Random rand, int p_74894_4_, int p_74894_5_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)`
- `protected void replaceAirAndLiquidDownwards(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void spawnVillagers(World worldIn, StructureBoundingBox structurebb, int x, int y, int z, int count)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected int averageGroundLvl`
- `protected boolean isZombieInfested`
- `protected StructureVillagePieces.Start startPiece`
- `protected int structureType`
