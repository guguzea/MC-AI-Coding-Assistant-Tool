# StructureStrongholdPieces.RoomCrossing

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureStrongholdPieces.Stronghold → net.minecraft.world.gen.structure.StructureStrongholdPieces.RoomCrossing

## Class signature

```java
public static class StructureStrongholdPieces.RoomCrossing extends StructureStrongholdPieces.Stronghold
```

## Constructors

- `RoomCrossing()`
- `RoomCrossing(int p_i45575_1_, java.util.Random p_i45575_2_, StructureBoundingBox p_i45575_3_, EnumFacing p_i45575_4_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)` — Initiates construction of the Structure Component picked, at the current Location of StructGen
- `static StructureStrongholdPieces.RoomCrossing func_175859_a(java.util.List<StructureComponent> p_175859_0_, java.util.Random p_175859_1_, int p_175859_2_, int p_175859_3_, int p_175859_4_, EnumFacing p_175859_5_, int p_175859_6_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected int roomType`