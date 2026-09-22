# ItemMap

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemMapBase → net.minecraft.item.ItemMap

## Class signature

```java
public class ItemMap extends ItemMapBase
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `Packet<?> createMapDataPacket(ItemStack stack, World worldIn, EntityPlayer player)`
- `protected static void enableMapTracking(ItemStack p_185064_0_, World p_185064_1_)`
- `static int getColor(ItemStack p_190907_0_)`
- `MapData getMapData(ItemStack stack, World worldIn)`
- `static MapData loadMapData(int mapId, World worldIn)`
- `void onCreated(ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `void onUpdate(ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `static void renderBiomePreviewMap(World p_190905_0_, ItemStack p_190905_1_)`
- `protected static void scaleMap(ItemStack p_185063_0_, World p_185063_1_, int p_185063_2_)`
- `static ItemStack setupNewMap(World p_190906_0_, double p_190906_1_, double p_190906_3_, byte p_190906_5_, boolean p_190906_6_, boolean p_190906_7_)`
- `void updateMapData(World worldIn, Entity viewer, MapData data)`

## Fields

- `protected ItemMap`