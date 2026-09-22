# StructureMineshaftPieces.Corridor

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureMineshaftPieces.Corridor

## Class signature

```java
public static class StructureMineshaftPieces.Corridor extends StructureComponent
```

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)` — Initiates construction of the Structure Component picked, at the current Location of StructGen
- `static StructureBoundingBox func_175814_a(java.util.List<StructureComponent> p_175814_0_, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `protected boolean generateChestContents(World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, java.util.List<WeightedRandomChestContent> listIn, int max)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `Corridor`
- `Corridor`