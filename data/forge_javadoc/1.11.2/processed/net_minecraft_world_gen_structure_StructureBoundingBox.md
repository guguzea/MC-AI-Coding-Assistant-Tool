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

- `static StructureBoundingBox createProper(int p_175899_0_, int p_175899_1_, int p_175899_2_, int p_175899_3_, int p_175899_4_, int p_175899_5_)`
- `void expandTo(StructureBoundingBox sbb)`
- `static StructureBoundingBox getComponentToAddBoundingBox(int structureMinX, int structureMinY, int structureMinZ, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, EnumFacing facing)`
- `Vec3i getLength()`
- `static StructureBoundingBox getNewBoundingBox()`
- `int getXSize()`
- `int getYSize()`
- `int getZSize()`
- `boolean intersectsWith(int minXIn, int minZIn, int maxXIn, int maxZIn)`
- `boolean intersectsWith(StructureBoundingBox structurebb)`
- `boolean isVecInside(Vec3i vec)`
- `void offset(int x, int y, int z)`
- `NBTTagIntArray toNBTTagIntArray()`
- `java.lang.String toString()`

## Fields

- `int maxX`
- `int maxY`
- `int maxZ`
- `int minX`
- `int minY`
- `int minZ`