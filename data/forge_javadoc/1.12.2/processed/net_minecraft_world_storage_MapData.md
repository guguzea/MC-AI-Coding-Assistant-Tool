# MapData

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldSavedData → net.minecraft.world.storage.MapData

## Class signature

```java
public class MapData extends WorldSavedData
```

## Constructors

- `MapData(java.lang.String mapname)`

## Methods

- `static void addTargetDecoration(ItemStack map, BlockPos target, java.lang.String decorationName, MapDecoration.Type type)`
- `void calculateMapCenter(double x, double z, int mapScale)`
- `MapData.MapInfo getMapInfo(EntityPlayer player)`
- `Packet<?> getMapPacket(ItemStack mapStack, World worldIn, EntityPlayer player)`
- `void readFromNBT(NBTTagCompound nbt)`
- `void updateMapData(int x, int y)`
- `void updateVisiblePlayers(EntityPlayer player, ItemStack mapStack)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `byte[] colors`
- `int dimension`
- `java.util.Map<java.lang.String, MapDecoration> mapDecorations`
- `java.util.List<MapData.MapInfo> playersArrayList`
- `byte scale`
- `boolean trackingPosition`
- `boolean unlimitedTracking`
- `int xCenter`
- `int zCenter`