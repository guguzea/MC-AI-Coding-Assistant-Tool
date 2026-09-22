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

- `static StructureBoundingBox createProper(int x1, int y1, int z1, int x2, int y2, int z2)`
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