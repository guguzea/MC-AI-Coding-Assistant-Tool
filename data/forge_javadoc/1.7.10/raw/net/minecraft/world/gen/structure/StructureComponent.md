---
title: "StructureComponent"
description: "public abstract class StructureComponent extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/gen/structure/StructureComponent.html"
sourceType: javadoc
---

# StructureComponent

## Class signature

```java
public abstract class StructureComponent extends java.lang.Object
```

## Constructors

- `public StructureComponent()`
- `protected StructureComponent(int p_i2091_1_)`

## Methods

- `public NBTTagCompound func_143010_b()`
- `protected abstract void func_143012_a( NBTTagCompound p_143012_1_)`
- `public void func_143009_a( World p_143009_1_, NBTTagCompound p_143009_2_)`
- `protected abstract void func_143011_b( NBTTagCompound p_143011_1_)`
- `public void buildComponent( StructureComponent p_74861_1_, java.util.List p_74861_2_, java.util.Random p_74861_3_)`
- `public abstract boolean addComponentParts( World p_74875_1_, java.util.Random p_74875_2_, StructureBoundingBox p_74875_3_)`
- `public StructureBoundingBox getBoundingBox()`
- `public int getComponentType()`
- `public static StructureComponent findIntersecting(java.util.List p_74883_0_, StructureBoundingBox p_74883_1_)`
- `public ChunkPosition func_151553_a()`
- `protected boolean isLiquidInStructureBoundingBox( World p_74860_1_, StructureBoundingBox p_74860_2_)`
- `protected int getXWithOffset(int p_74865_1_, int p_74865_2_)`
- `protected int getYWithOffset(int p_74862_1_)`
- `protected int getZWithOffset(int p_74873_1_, int p_74873_2_)`
- `protected int getMetadataWithOffset( Block p_151555_1_, int p_151555_2_)`
- `protected void placeBlockAtCurrentPosition( World p_151550_1_, Block p_151550_2_, int p_151550_3_, int p_151550_4_, int p_151550_5_, int p_151550_6_, StructureBoundingBox p_151550_7_)`
- `protected Block getBlockAtCurrentPosition( World p_151548_1_, int p_151548_2_, int p_151548_3_, int p_151548_4_, StructureBoundingBox p_151548_5_)`
- `protected void fillWithAir( World p_74878_1_, StructureBoundingBox p_74878_2_, int p_74878_3_, int p_74878_4_, int p_74878_5_, int p_74878_6_, int p_74878_7_, int p_74878_8_)`
- `protected void fillWithBlocks( World p_151549_1_, StructureBoundingBox p_151549_2_, int p_151549_3_, int p_151549_4_, int p_151549_5_, int p_151549_6_, int p_151549_7_, int p_151549_8_, Block p_151549_9_, Block p_151549_10_, boolean p_151549_11_)`
- `protected void fillWithMetadataBlocks( World p_151556_1_, StructureBoundingBox p_151556_2_, int p_151556_3_, int p_151556_4_, int p_151556_5_, int p_151556_6_, int p_151556_7_, int p_151556_8_, Block p_151556_9_, int p_151556_10_, Block p_151556_11_, int p_151556_12_, boolean p_151556_13_)`
- `protected void fillWithRandomizedBlocks( World p_74882_1_, StructureBoundingBox p_74882_2_, int p_74882_3_, int p_74882_4_, int p_74882_5_, int p_74882_6_, int p_74882_7_, int p_74882_8_, boolean p_74882_9_, java.util.Random p_74882_10_, StructureComponent.BlockSelector p_74882_11_)`
- `protected void randomlyFillWithBlocks( World p_151551_1_, StructureBoundingBox p_151551_2_, java.util.Random p_151551_3_, float p_151551_4_, int p_151551_5_, int p_151551_6_, int p_151551_7_, int p_151551_8_, int p_151551_9_, int p_151551_10_, Block p_151551_11_, Block p_151551_12_, boolean p_151551_13_)`
- `protected void func_151552_a( World p_151552_1_, StructureBoundingBox p_151552_2_, java.util.Random p_151552_3_, float p_151552_4_, int p_151552_5_, int p_151552_6_, int p_151552_7_, Block p_151552_8_, int p_151552_9_)`
- `protected void func_151547_a( World p_151547_1_, StructureBoundingBox p_151547_2_, int p_151547_3_, int p_151547_4_, int p_151547_5_, int p_151547_6_, int p_151547_7_, int p_151547_8_, Block p_151547_9_, boolean p_151547_10_)`
- `protected void clearCurrentPositionBlocksUpwards( World p_74871_1_, int p_74871_2_, int p_74871_3_, int p_74871_4_, StructureBoundingBox p_74871_5_)`
- `protected void func_151554_b( World p_151554_1_, Block p_151554_2_, int p_151554_3_, int p_151554_4_, int p_151554_5_, int p_151554_6_, StructureBoundingBox p_151554_7_)`
- `protected boolean generateStructureChestContents( World p_74879_1_, StructureBoundingBox p_74879_2_, java.util.Random p_74879_3_, int p_74879_4_, int p_74879_5_, int p_74879_6_, WeightedRandomChestContent [] p_74879_7_, int p_74879_8_)`
- `protected boolean generateStructureDispenserContents( World p_74869_1_, StructureBoundingBox p_74869_2_, java.util.Random p_74869_3_, int p_74869_4_, int p_74869_5_, int p_74869_6_, int p_74869_7_, WeightedRandomChestContent [] p_74869_8_, int p_74869_9_)`
- `protected void placeDoorAtCurrentPosition( World p_74881_1_, StructureBoundingBox p_74881_2_, java.util.Random p_74881_3_, int p_74881_4_, int p_74881_5_, int p_74881_6_, int p_74881_7_)`
