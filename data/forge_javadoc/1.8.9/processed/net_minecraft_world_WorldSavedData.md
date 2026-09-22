# WorldSavedData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData

## Class signature

```java
public abstract class WorldSavedData extends java.lang.Object
```

## Constructors

- `WorldSavedData(java.lang.String name)`

## Methods

- `boolean isDirty()` — Whether this MapDataBase needs saving to disk.
- `void markDirty()` — Marks this MapDataBase dirty, to be saved to disk when the level next saves.
- `abstract void readFromNBT(NBTTagCompound nbt)` — reads in data from the NBTTagCompound into this MapDataBase
- `void setDirty(boolean isDirty)` — Sets the dirty state of this MapDataBase, whether it needs saving to disk.
- `abstract void writeToNBT(NBTTagCompound nbt)` — write data to NBTTagCompound from this MapDataBase, similar to Entities and TileEntities

## Fields

- `java.lang.String mapName` — The name of the map data nbt