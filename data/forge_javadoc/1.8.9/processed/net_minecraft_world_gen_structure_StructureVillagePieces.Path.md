# StructureVillagePieces.Path

## Constructors

- `public Path()`
- `public Path( StructureVillagePieces.Start start, int p_i45562_2_, java.util.Random rand, StructureBoundingBox p_i45562_4_, EnumFacing facing)`

## Methods

- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound)`
- `public void buildComponent( StructureComponent componentIn, java.util.List< StructureComponent > listIn, java.util.Random rand)`
- `public static StructureBoundingBox func_175848_a( StructureVillagePieces.Start start, java.util.List< StructureComponent > p_175848_1_, java.util.Random rand, int p_175848_3_, int p_175848_4_, int p_175848_5_, EnumFacing facing)`
- `public boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`

## Description

second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...