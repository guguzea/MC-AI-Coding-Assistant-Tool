---
title: "ComponentScatteredFeaturePieces.JunglePyramid"
description: "public static class ComponentScatteredFeaturePieces.JunglePyramid extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/ComponentScatteredFeaturePieces.JunglePyramid.html"
sourceType: javadoc
---

# ComponentScatteredFeaturePieces.JunglePyramid

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.ComponentScatteredFeaturePieces.JunglePyramid

## Class signature

```java
public static class ComponentScatteredFeaturePieces.JunglePyramid extends StructureComponent
```

## Constructors

- `JunglePyramid()`
- `JunglePyramid(java.util.Random p_i2064_1_, int p_i2064_2_, int p_i2064_3_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `protected boolean func_74935_a(World worldIn, StructureBoundingBox p_74935_2_, int p_74935_3_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected int field_74936_d`
- `protected int scatteredFeatureSizeX` — The size of the bounding box for this feature in the X axis
- `protected int scatteredFeatureSizeY` — The size of the bounding box for this feature in the Y axis
- `protected int scatteredFeatureSizeZ` — The size of the bounding box for this feature in the Z axis
