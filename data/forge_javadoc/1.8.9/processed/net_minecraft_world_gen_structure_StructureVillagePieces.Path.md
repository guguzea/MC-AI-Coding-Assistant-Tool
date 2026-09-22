# StructureVillagePieces.Path

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureVillagePieces.Village → net.minecraft.world.gen.structure.StructureVillagePieces.Road → net.minecraft.world.gen.structure.StructureVillagePieces.Path

## Class signature

```java
public static class StructureVillagePieces.Path extends StructureVillagePieces.Road
```

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)` — Initiates construction of the Structure Component picked, at the current Location of StructGen
- `static StructureBoundingBox func_175848_a(StructureVillagePieces.Start start, java.util.List<StructureComponent> p_175848_1_, java.util.Random rand, int p_175848_3_, int p_175848_4_, int p_175848_5_, EnumFacing facing)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `Path`
- `Path`