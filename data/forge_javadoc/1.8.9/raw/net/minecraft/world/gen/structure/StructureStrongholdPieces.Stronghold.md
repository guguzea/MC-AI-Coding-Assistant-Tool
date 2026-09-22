---
title: "StructureStrongholdPieces.Stronghold"
description: "public abstract static class StructureStrongholdPieces.Stronghold extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureStrongholdPieces.Stronghold.html"
sourceType: javadoc
---

# StructureStrongholdPieces.Stronghold

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureStrongholdPieces.Stronghold

## Class signature

```java
public abstract static class StructureStrongholdPieces.Stronghold extends StructureComponent
```

## Constructors

- `Stronghold()`
- `Stronghold(int p_i2087_1_)`

## Methods

- `protected static boolean canStrongholdGoDeeper(StructureBoundingBox p_74991_0_)` — returns false if the Structure Bounding Box goes below 10
- `protected StructureComponent getNextComponentNormal(StructureStrongholdPieces.Stairs2 p_74986_1_, java.util.List<StructureComponent> p_74986_2_, java.util.Random p_74986_3_, int p_74986_4_, int p_74986_5_)` — Gets the next component in any cardinal direction
- `protected StructureComponent getNextComponentX(StructureStrongholdPieces.Stairs2 p_74989_1_, java.util.List<StructureComponent> p_74989_2_, java.util.Random p_74989_3_, int p_74989_4_, int p_74989_5_)` — Gets the next component in the +/- X direction
- `protected StructureComponent getNextComponentZ(StructureStrongholdPieces.Stairs2 p_74987_1_, java.util.List<StructureComponent> p_74987_2_, java.util.Random p_74987_3_, int p_74987_4_, int p_74987_5_)` — Gets the next component in the +/- Z direction
- `protected StructureStrongholdPieces.Stronghold.Door getRandomDoor(java.util.Random p_74988_1_)`
- `protected void placeDoor(World worldIn, java.util.Random p_74990_2_, StructureBoundingBox p_74990_3_, StructureStrongholdPieces.Stronghold.Door p_74990_4_, int p_74990_5_, int p_74990_6_, int p_74990_7_)` — builds a door of the enumerated types (empty opening is a door)
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected StructureStrongholdPieces.Stronghold.Door field_143013_d`
