---
title: "StructureBoundingBox"
description: "public class StructureBoundingBox extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureBoundingBox.html"
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
- `StructureBoundingBox(int[] coords)`
- `StructureBoundingBox(int xMin, int zMin, int xMax, int zMax)`
- `StructureBoundingBox(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax)`
- `StructureBoundingBox(StructureBoundingBox structurebb)`
- `StructureBoundingBox(Vec3i vec1, Vec3i vec2)`

## Methods

- `void expandTo(StructureBoundingBox sbb)` — Expands a bounding box's dimensions to include the supplied bounding box.
- `Vec3i func_175896_b()`
- `static StructureBoundingBox func_175899_a(int p_175899_0_, int p_175899_1_, int p_175899_2_, int p_175899_3_, int p_175899_4_, int p_175899_5_)`
- `Vec3i getCenter()`
- `static StructureBoundingBox getComponentToAddBoundingBox(int p_175897_0_, int p_175897_1_, int p_175897_2_, int p_175897_3_, int p_175897_4_, int p_175897_5_, int p_175897_6_, int p_175897_7_, int p_175897_8_, EnumFacing p_175897_9_)` — Create a bounding box with the specified dimensions and rotate it.
- `static StructureBoundingBox getNewBoundingBox()` — returns a new StructureBoundingBox with MAX values
- `int getXSize()` — Get dimension of the bounding box in the x direction.
- `int getYSize()` — Get dimension of the bounding box in the y direction.
- `int getZSize()` — Get dimension of the bounding box in the z direction.
- `boolean intersectsWith(int minXIn, int minZIn, int maxXIn, int maxZIn)` — Discover if a coordinate is inside the bounding box area.
- `boolean intersectsWith(StructureBoundingBox structurebb)` — Discover if bounding box can fit within the current bounding box object.
- `boolean isVecInside(Vec3i vec)` — Checks if given Vec3i is inside of StructureBoundingBox
- `void offset(int x, int y, int z)` — Offsets the current bounding box by the specified coordinates.
- `NBTTagIntArray toNBTTagIntArray()`
- `java.lang.String toString()`

## Fields

- `int maxX` — The second x coordinate of a bounding box.
- `int maxY` — The second y coordinate of a bounding box.
- `int maxZ` — The second z coordinate of a bounding box.
- `int minX` — The first x coordinate of a bounding box.
- `int minY` — The first y coordinate of a bounding box.
- `int minZ` — The first z coordinate of a bounding box.
