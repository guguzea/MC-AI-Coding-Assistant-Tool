# StructureNetherBridgePieces.Start

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureNetherBridgePieces.Crossing3 → net.minecraft.world.gen.structure.StructureNetherBridgePieces.Start

## Class signature

```java
public static class StructureNetherBridgePieces.Start extends StructureNetherBridgePieces.Crossing3
```

## Constructors

- `Start()`
- `Start(java.util.Random p_i2059_1_, int p_i2059_2_, int p_i2059_3_)`

## Methods

- `protected StructureComponent getNextComponentNormal(StructureNetherBridgePieces.Start p_74963_1_, java.util.List<StructureComponent> p_74963_2_, java.util.Random p_74963_3_, int p_74963_4_, int p_74963_5_, boolean p_74963_6_)` — Gets the next component in any cardinal direction
- `protected StructureComponent getNextComponentX(StructureNetherBridgePieces.Start p_74961_1_, java.util.List<StructureComponent> p_74961_2_, java.util.Random p_74961_3_, int p_74961_4_, int p_74961_5_, boolean p_74961_6_)` — Gets the next component in the +/- X direction
- `protected StructureComponent getNextComponentZ(StructureNetherBridgePieces.Start p_74965_1_, java.util.List<StructureComponent> p_74965_2_, java.util.Random p_74965_3_, int p_74965_4_, int p_74965_5_, boolean p_74965_6_)` — Gets the next component in the +/- Z direction
- `protected static boolean isAboveGround(StructureBoundingBox p_74964_0_)` — Checks if the bounding box's minY is > 10
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected static java.util.List<WeightedRandomChestContent> field_111019_a`
- `java.util.List<StructureComponent> field_74967_d`
- `java.util.List<net.minecraft.world.gen.structure.StructureNetherBridgePieces.PieceWeight> primaryWeights`
- `java.util.List<net.minecraft.world.gen.structure.StructureNetherBridgePieces.PieceWeight> secondaryWeights`
- `net.minecraft.world.gen.structure.StructureNetherBridgePieces.PieceWeight theNetherBridgePieceWeight` — Instance of StructureNetherBridgePieceWeight.