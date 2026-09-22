# StructureComponentTemplate

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureComponentTemplate

## Class signature

```java
public abstract class StructureComponentTemplate extends StructureComponent
```

## Constructors

- `StructureComponentTemplate()`
- `StructureComponentTemplate(int p_i46662_1_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `protected abstract void handleDataMarker(java.lang.String p_186175_1_, BlockPos p_186175_2_, World p_186175_3_, java.util.Random p_186175_4_, StructureBoundingBox p_186175_5_)`
- `void offset(int x, int y, int z)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)`
- `protected void setup(Template p_186173_1_, BlockPos p_186173_2_, PlacementSettings p_186173_3_)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected PlacementSettings placeSettings`
- `protected Template template`
- `protected BlockPos templatePosition`