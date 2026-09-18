# StructureComponentTemplate

## Class signature

```java
public abstract class StructureComponentTemplate extends StructureComponent
```

## Constructors

- `public StructureComponentTemplate()`
- `public StructureComponentTemplate(int type)`

## Methods

- `protected void setup( Template templateIn, BlockPos pos, PlacementSettings settings)`
- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `public boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `protected abstract void handleDataMarker(java.lang.String function, BlockPos pos, World worldIn, java.util.Random rand, StructureBoundingBox sbb)`
- `public void offset(int x, int y, int z)`