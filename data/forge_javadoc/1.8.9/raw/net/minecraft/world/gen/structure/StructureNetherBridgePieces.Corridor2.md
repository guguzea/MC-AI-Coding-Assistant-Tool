---
title: "StructureNetherBridgePieces.Corridor2"
description: "public static class StructureNetherBridgePieces.Corridor2 extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureNetherBridgePieces.Corridor2.html"
sourceType: javadoc
---

# StructureNetherBridgePieces.Corridor2

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureNetherBridgePieces.Corridor2

## Class signature

```java
public static class StructureNetherBridgePieces.Corridor2 extends StructureComponent
```

## Constructors

- `Corridor2()`
- `Corridor2(int p_i45613_1_, java.util.Random p_i45613_2_, StructureBoundingBox p_i45613_3_, EnumFacing p_i45613_4_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)` — Initiates construction of the Structure Component picked, at the current Location of StructGen
- `static StructureNetherBridgePieces.Corridor2 func_175876_a(java.util.List<StructureComponent> p_175876_0_, java.util.Random p_175876_1_, int p_175876_2_, int p_175876_3_, int p_175876_4_, EnumFacing p_175876_5_, int p_175876_6_)`
- `protected StructureComponent getNextComponentNormal(StructureNetherBridgePieces.Start p_74963_1_, java.util.List<StructureComponent> p_74963_2_, java.util.Random p_74963_3_, int p_74963_4_, int p_74963_5_, boolean p_74963_6_)` — Gets the next component in any cardinal direction
- `protected StructureComponent getNextComponentX(StructureNetherBridgePieces.Start p_74961_1_, java.util.List<StructureComponent> p_74961_2_, java.util.Random p_74961_3_, int p_74961_4_, int p_74961_5_, boolean p_74961_6_)` — Gets the next component in the +/- X direction
- `protected StructureComponent getNextComponentZ(StructureNetherBridgePieces.Start p_74965_1_, java.util.List<StructureComponent> p_74965_2_, java.util.Random p_74965_3_, int p_74965_4_, int p_74965_5_, boolean p_74965_6_)` — Gets the next component in the +/- Z direction
- `protected static boolean isAboveGround(StructureBoundingBox p_74964_0_)` — Checks if the bounding box's minY is > 10
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected static java.util.List<WeightedRandomChestContent> field_111019_a`
