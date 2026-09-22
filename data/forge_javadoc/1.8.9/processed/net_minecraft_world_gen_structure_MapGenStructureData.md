# MapGenStructureData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData → net.minecraft.world.gen.structure.MapGenStructureData

## Class signature

```java
public class MapGenStructureData extends WorldSavedData
```

## Methods

- `static java.lang.String formatChunkCoords(int chunkX, int chunkZ)`
- `NBTTagCompound getTagCompound()`
- `void readFromNBT(NBTTagCompound nbt)` — reads in data from the NBTTagCompound into this MapDataBase
- `void writeInstance(NBTTagCompound tagCompoundIn, int chunkX, int chunkZ)` — Writes the NBT tag of an instance of this structure type to the internal NBT tag, using the chunkcoordinates as the key
- `void writeToNBT(NBTTagCompound nbt)` — write data to NBTTagCompound from this MapDataBase, similar to Entities and TileEntities

## Fields

- `MapGenStructureData`