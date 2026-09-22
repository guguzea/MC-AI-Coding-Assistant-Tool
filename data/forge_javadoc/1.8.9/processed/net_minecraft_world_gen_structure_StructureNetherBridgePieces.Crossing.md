# StructureNetherBridgePieces.Crossing

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureNetherBridgePieces.Crossing

## Class signature

```java
public static class StructureNetherBridgePieces.Crossing extends StructureComponent
```

## Constructors

- `Crossing()`
- `Crossing(int p_i45610_1_, java.util.Random p_i45610_2_, StructureBoundingBox p_i45610_3_, EnumFacing p_i45610_4_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)` — Initiates construction of the Structure Component picked, at the current Location of StructGen
- `static StructureNetherBridgePieces.Crossing func_175873_a(java.util.List<StructureComponent> p_175873_0_, java.util.Random p_175873_1_, int p_175873_2_, int p_175873_3_, int p_175873_4_, EnumFacing p_175873_5_, int p_175873_6_)`
- `protected StructureComponent getNextComponentNormal(StructureNetherBridgePieces.Start p_74963_1_, java.util.List<StructureComponent> p_74963_2_, java.util.Random p_74963_3_, int p_74963_4_, int p_74963_5_, boolean p_74963_6_)` — Gets the next component in any cardinal direction
- `protected StructureComponent getNextComponentX(StructureNetherBridgePieces.Start p_74961_1_, java.util.List<StructureComponent> p_74961_2_, java.util.Random p_74961_3_, int p_74961_4_, int p_74961_5_, boolean p_74961_6_)` — Gets the next component in the +/- X direction
- `protected StructureComponent getNextComponentZ(StructureNetherBridgePieces.Start p_74965_1_, java.util.List<StructureComponent> p_74965_2_, java.util.Random p_74965_3_, int p_74965_4_, int p_74965_5_, boolean p_74965_6_)` — Gets the next component in the +/- Z direction
- `protected static boolean isAboveGround(StructureBoundingBox p_74964_0_)` — Checks if the bounding box's minY is > 10
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected static java.util.List<WeightedRandomChestContent> field_111019_a`