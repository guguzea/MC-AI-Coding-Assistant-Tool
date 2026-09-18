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
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189551_1_)`
- `public static java.lang.String fileNameForProvider( WorldProvider provider)`