# VillageCollection

## Class signature

```java
public class VillageCollection extends WorldSavedData
```

## Constructors

- `public VillageCollection(java.lang.String name)`
- `public VillageCollection( World worldIn)`

## Methods

- `public void setWorldsForAll( World worldIn)`
- `public void addToVillagerPositionList( BlockPos pos)`
- `public void tick()`
- `public java.util.List< Village > getVillageList()`
- `public Village getNearestVillage( BlockPos doorBlock, int radius)`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public void writeToNBT( NBTTagCompound nbt)`
- `public static java.lang.String fileNameForProvider( WorldProvider provider)`

## Description

reads in data from the NBTTagCompound into this MapDataBase