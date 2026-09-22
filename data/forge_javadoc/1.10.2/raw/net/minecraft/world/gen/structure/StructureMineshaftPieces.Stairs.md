---
title: "StructureMineshaftPieces.Stairs"
description: "public static class StructureMineshaftPieces.Stairs extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/structure/StructureMineshaftPieces.Stairs.html"
sourceType: javadoc
---

# StructureMineshaftPieces.Stairs

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureMineshaftPieces.Stairs

## Class signature

```java
public static class StructureMineshaftPieces.Stairs extends StructureComponent
```

## Constructors

- `Stairs()`
- `Stairs(int p_i47136_1_, java.util.Random p_i47136_2_, StructureBoundingBox p_i47136_3_, EnumFacing p_i47136_4_, MapGenMineshaft.Type p_i47136_5_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)`
- `static StructureBoundingBox findStairs(java.util.List<StructureComponent> listIn, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `protected IBlockState func_189917_F_()`
- `protected boolean func_189918_a(World p_189918_1_, StructureBoundingBox p_189918_2_, int p_189918_3_, int p_189918_4_, int p_189918_5_, int p_189918_6_)`
- `protected IBlockState func_189919_b()`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected MapGenMineshaft.Type mineShaftType`
