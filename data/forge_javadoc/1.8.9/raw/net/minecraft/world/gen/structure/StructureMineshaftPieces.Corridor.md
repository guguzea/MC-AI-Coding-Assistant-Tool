---
title: "StructureMineshaftPieces.Corridor"
description: "second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences..."
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureMineshaftPieces.Corridor.html"
sourceType: javadoc
---

# StructureMineshaftPieces.Corridor

## Constructors

- `public Corridor()`
- `public Corridor(int type, java.util.Random rand, StructureBoundingBox structurebb, EnumFacing facing)`

## Methods

- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound)`
- `public static StructureBoundingBox func_175814_a(java.util.List< StructureComponent > p_175814_0_, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `public void buildComponent( StructureComponent componentIn, java.util.List< StructureComponent > listIn, java.util.Random rand)`
- `protected boolean generateChestContents( World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, java.util.List< WeightedRandomChestContent > listIn, int max)`
- `public boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`

## Description

second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
