# StructureNetherBridgePieces.Corridor3

## Constructors

- `public Corridor3()`
- `public Corridor3(int p_i45619_1_, java.util.Random p_i45619_2_, StructureBoundingBox p_i45619_3_, EnumFacing p_i45619_4_)`

## Methods

- `public void buildComponent( StructureComponent componentIn, java.util.List< StructureComponent > listIn, java.util.Random rand)`
- `public static StructureNetherBridgePieces.Corridor3 func_175883_a(java.util.List< StructureComponent > p_175883_0_, java.util.Random p_175883_1_, int p_175883_2_, int p_175883_3_, int p_175883_4_, EnumFacing p_175883_5_, int p_175883_6_)`
- `public boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound)`
- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected StructureComponent getNextComponentNormal( StructureNetherBridgePieces.Start p_74963_1_, java.util.List< StructureComponent > p_74963_2_, java.util.Random p_74963_3_, int p_74963_4_, int p_74963_5_, boolean p_74963_6_)`
- `protected StructureComponent getNextComponentX( StructureNetherBridgePieces.Start p_74961_1_, java.util.List< StructureComponent > p_74961_2_, java.util.Random p_74961_3_, int p_74961_4_, int p_74961_5_, boolean p_74961_6_)`
- `protected StructureComponent getNextComponentZ( StructureNetherBridgePieces.Start p_74965_1_, java.util.List< StructureComponent > p_74965_2_, java.util.Random p_74965_3_, int p_74965_4_, int p_74965_5_, boolean p_74965_6_)`
- `protected static boolean isAboveGround( StructureBoundingBox p_74964_0_)`

## Description

second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...