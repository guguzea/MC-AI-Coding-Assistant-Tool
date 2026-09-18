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
- `public static StructureBoundingBox getComponentToAddBoundingBox(int p_175897_0_, int p_175897_1_, int p_175897_2_, int p_175897_3_, int p_175897_4_, int p_175897_5_, int p_175897_6_, int p_175897_7_, int p_175897_8_, EnumFacing p_175897_9_)`
- `public static StructureBoundingBox func_175899_a(int p_175899_0_, int p_175899_1_, int p_175899_2_, int p_175899_3_, int p_175899_4_, int p_175899_5_)`
- `public boolean intersectsWith( StructureBoundingBox structurebb)`
- `public boolean intersectsWith(int minXIn, int minZIn, int maxXIn, int maxZIn)`
- `public void expandTo( StructureBoundingBox sbb)`
- `public void offset(int x, int y, int z)`
- `public boolean isVecInside( Vec3i vec)`
- `public Vec3i func_175896_b()`
- `public int getXSize()`
- `public int getYSize()`
- `public int getZSize()`
- `public Vec3i getCenter()`
- `public java.lang.String toString()`
- `public NBTTagIntArray toNBTTagIntArray()`

## Description

The second x coordinate of a bounding box.