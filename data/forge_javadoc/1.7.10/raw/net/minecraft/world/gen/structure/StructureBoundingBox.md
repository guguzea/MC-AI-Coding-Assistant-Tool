---
title: "StructureBoundingBox"
description: "public class StructureBoundingBox extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/gen/structure/StructureBoundingBox.html"
sourceType: javadoc
---

# StructureBoundingBox

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureBoundingBox

## Class signature

```java
public class StructureBoundingBox extends java.lang.Object
```

## Constructors

- `StructureBoundingBox()`
- `StructureBoundingBox(int[] p_i43000_1_)`
- `StructureBoundingBox(int p_i2033_1_, int p_i2033_2_, int p_i2033_3_, int p_i2033_4_)`
- `StructureBoundingBox(int p_i2032_1_, int p_i2032_2_, int p_i2032_3_, int p_i2032_4_, int p_i2032_5_, int p_i2032_6_)`
- `StructureBoundingBox(StructureBoundingBox p_i2031_1_)`

## Methods

- `void expandTo(StructureBoundingBox p_78888_1_)`
- `NBTTagIntArray func_151535_h()`
- `int getCenterX()`
- `int getCenterY()`
- `int getCenterZ()`
- `static StructureBoundingBox getComponentToAddBoundingBox(int p_78889_0_, int p_78889_1_, int p_78889_2_, int p_78889_3_, int p_78889_4_, int p_78889_5_, int p_78889_6_, int p_78889_7_, int p_78889_8_, int p_78889_9_)`
- `static StructureBoundingBox getNewBoundingBox()`
- `int getXSize()`
- `int getYSize()`
- `int getZSize()`
- `boolean intersectsWith(int p_78885_1_, int p_78885_2_, int p_78885_3_, int p_78885_4_)`
- `boolean intersectsWith(StructureBoundingBox p_78884_1_)`
- `boolean isVecInside(int p_78890_1_, int p_78890_2_, int p_78890_3_)`
- `void offset(int p_78886_1_, int p_78886_2_, int p_78886_3_)`
- `java.lang.String toString()`

## Fields

- `int maxX`
- `int maxY`
- `int maxZ`
- `int minX`
- `int minY`
- `int minZ`
