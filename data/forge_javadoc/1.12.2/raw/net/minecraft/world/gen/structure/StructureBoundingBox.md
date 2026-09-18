---
title: "StructureBoundingBox"
description: "public class StructureBoundingBox extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/structure/StructureBoundingBox.html"
sourceType: javadoc
---

# StructureBoundingBox

## Class signature

```java
public class StructureBoundingBox extends java.lang.Object
```

## Constructors

- `public StructureBoundingBox()`
- `public StructureBoundingBox(int[] coords)`
- `public StructureBoundingBox( StructureBoundingBox structurebb)`
- `public StructureBoundingBox(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax)`
- `public StructureBoundingBox( Vec3i vec1, Vec3i vec2)`
- `public StructureBoundingBox(int xMin, int zMin, int xMax, int zMax)`

## Methods

- `public static StructureBoundingBox getNewBoundingBox()`
- `public static StructureBoundingBox getComponentToAddBoundingBox(int structureMinX, int structureMinY, int structureMinZ, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, EnumFacing facing)`
- `public static StructureBoundingBox createProper(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public boolean intersectsWith( StructureBoundingBox structurebb)`
- `public boolean intersectsWith(int minXIn, int minZIn, int maxXIn, int maxZIn)`
- `public void expandTo( StructureBoundingBox sbb)`
- `public void offset(int x, int y, int z)`
- `public boolean isVecInside( Vec3i vec)`
- `public Vec3i getLength()`
- `public int getXSize()`
- `public int getYSize()`
- `public int getZSize()`
- `public java.lang.String toString()`
- `public NBTTagIntArray toNBTTagIntArray()`
