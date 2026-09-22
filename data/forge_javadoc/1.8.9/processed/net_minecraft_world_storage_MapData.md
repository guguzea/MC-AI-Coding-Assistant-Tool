# MapData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData → net.minecraft.world.storage.MapData

## Class signature

```java
public class MapData extends WorldSavedData
```

## Constructors

- `MapData(java.lang.String mapname)`

## Methods

- `void calculateMapCenter(double x, double z, int mapScale)`
- `MapData.MapInfo getMapInfo(EntityPlayer player)`
- `Packet getMapPacket(ItemStack mapStack, World worldIn, EntityPlayer player)`
- `void readFromNBT(NBTTagCompound nbt)` — reads in data from the NBTTagCompound into this MapDataBase
- `void updateMapData(int x, int y)`
- `void updateVisiblePlayers(EntityPlayer player, ItemStack mapStack)` — Adds the player passed to the list of visible players and checks to see which players are visible
- `void writeToNBT(NBTTagCompound nbt)` — write data to NBTTagCompound from this MapDataBase, similar to Entities and TileEntities

## Fields

- `byte[] colors` — colours
- `int dimension`
- `java.util.Map<java.lang.String, Vec4b> mapDecorations`
- `java.util.List<MapData.MapInfo> playersArrayList`
- `byte scale`
- `int xCenter`
- `int zCenter`