---
title: "StructureVillagePieces.Village"
description: "public abstract static class StructureVillagePieces.Village extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureVillagePieces.Village.html"
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

- `protected static boolean canVillageGoDeeper(StructureBoundingBox p_74895_0_)`
- `protected void fillWithBlocks(World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)` — Fill the given area with the selected blocks
- `protected void func_175846_a(boolean p_175846_1_)`
- `protected IBlockState func_175847_a(IBlockState p_175847_1_)`
- `protected int func_180779_c(int p_180779_1_, int p_180779_2_)`
- `protected int getAverageGroundLevel(World worldIn, StructureBoundingBox p_74889_2_)` — Discover the y coordinate that will serve as the ground level of the supplied BoundingBox.
- `protected StructureComponent getNextComponentNN(StructureVillagePieces.Start start, java.util.List<StructureComponent> p_74891_2_, java.util.Random rand, int p_74891_4_, int p_74891_5_)` — Gets the next village component, with the bounding box shifted -1 in the X and Z direction.
- `protected StructureComponent getNextComponentPP(StructureVillagePieces.Start start, java.util.List<StructureComponent> p_74894_2_, java.util.Random rand, int p_74894_4_, int p_74894_5_)` — Gets the next village component, with the bounding box shifted +1 in the X and Z direction.
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void replaceAirAndLiquidDownwards(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)` — Replaces air and liquid from given position downwards.
- `protected void setBlockState(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void spawnVillagers(World worldIn, StructureBoundingBox p_74893_2_, int p_74893_3_, int p_74893_4_, int p_74893_5_, int p_74893_6_)` — Spawns a number of villagers in this component.
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected int field_143015_k`
