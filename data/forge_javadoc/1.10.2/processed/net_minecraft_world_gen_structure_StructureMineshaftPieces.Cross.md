# StructureMineshaftPieces.Cross

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureMineshaftPieces.Cross

## Class signature

```java
public static class StructureMineshaftPieces.Cross extends StructureComponent
```

## Constructors

- `Cross()`
- `Cross(int p_i47139_1_, java.util.Random p_i47139_2_, StructureBoundingBox p_i47139_3_, EnumFacing p_i47139_4_, MapGenMineshaft.Type p_i47139_5_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)`
- `static StructureBoundingBox findCrossing(java.util.List<StructureComponent> listIn, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `protected IBlockState func_189917_F_()`
- `protected boolean func_189918_a(World p_189918_1_, StructureBoundingBox p_189918_2_, int p_189918_3_, int p_189918_4_, int p_189918_5_, int p_189918_6_)`
- `protected IBlockState func_189919_b()`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected MapGenMineshaft.Type mineShaftType`