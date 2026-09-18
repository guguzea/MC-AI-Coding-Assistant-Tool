# ItemMap

## Class signature

```java
public class ItemMap extends ItemMapBase
```

## Constructors

- `protected ItemMap()`

## Methods

- `public static MapData loadMapData(int mapId, World worldIn)`
- `public MapData getMapData( ItemStack stack, World worldIn)`
- `public void updateMapData( World worldIn, Entity viewer, MapData data)`
- `public void onUpdate( ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `@Nullable public Packet <?> createMapDataPacket( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void onCreated( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `protected static void scaleMap( ItemStack p_185063_0_, World p_185063_1_, int p_185063_2_)`
- `protected static void enableMapTracking( ItemStack p_185064_0_, World p_185064_1_)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`