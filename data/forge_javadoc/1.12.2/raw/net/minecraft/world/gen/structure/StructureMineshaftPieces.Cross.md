---
title: "StructureMineshaftPieces.Cross"
description: "public static class StructureMineshaftPieces.Cross extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/structure/StructureMineshaftPieces.Cross.html"
sourceType: javadoc
---

# StructureMineshaftPieces.Cross

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureMineshaftPieces.Cross

## Class signature

```java
public static class StructureMineshaftPieces.Cross extends StructureComponent
```

## Constructors

- `Cross()`
- `Cross(int p_i47139_1_, java.util.Random p_i47139_2_, StructureBoundingBox p_i47139_3_, EnumFacing p_i47139_4_, MapGenMineshaft.Type p_i47139_5_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)`
- `static StructureBoundingBox findCrossing(java.util.List<StructureComponent> listIn, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `protected IBlockState getFenceBlock()`
- `protected IBlockState getPlanksBlock()`
- `protected boolean isSupportingBox(World p_189918_1_, StructureBoundingBox p_189918_2_, int p_189918_3_, int p_189918_4_, int p_189918_5_, int p_189918_6_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected MapGenMineshaft.Type mineShaftType`
