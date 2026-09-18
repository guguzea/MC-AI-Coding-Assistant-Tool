# StructureMineshaftPieces.Room

## Constructors

- `public Room()`
- `public Room(int type, java.util.Random rand, int x, int z)`

## Methods

- `public void buildComponent( StructureComponent componentIn, java.util.List< StructureComponent > listIn, java.util.Random rand)`
- `public boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `public void func_181138_a(int p_181138_1_, int p_181138_2_, int p_181138_3_)`
- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound)`

## Description

second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...