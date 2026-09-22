# StructureMineshaftPieces.Corridor

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureMineshaftPieces.Corridor

## Class signature

```java
public static class StructureMineshaftPieces.Corridor extends StructureComponent
```

## Constructors

- `Corridor()`
- `Corridor(int p_i47140_1_, java.util.Random p_i47140_2_, StructureBoundingBox p_i47140_3_, EnumFacing p_i47140_4_, MapGenMineshaft.Type p_i47140_5_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)`
- `static StructureBoundingBox findCorridorSize(java.util.List<StructureComponent> p_175814_0_, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `protected boolean generateChest(World worldIn, StructureBoundingBox structurebb, java.util.Random randomIn, int x, int y, int z, ResourceLocation loot)`
- `protected IBlockState getFenceBlock()`
- `protected IBlockState getPlanksBlock()`
- `protected boolean isSupportingBox(World p_189918_1_, StructureBoundingBox p_189918_2_, int p_189918_3_, int p_189918_4_, int p_189918_5_, int p_189918_6_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected MapGenMineshaft.Type mineShaftType`