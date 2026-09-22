---
title: "ItemMap"
description: "public class ItemMap extends ItemMapBase"
package: "net/minecraft/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemMap.html"
sourceType: javadoc
---

# ItemMap

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemMapBase → net.minecraft.item.ItemMap

## Class signature

```java
public class ItemMap extends ItemMapBase
```

## Methods

- `void addInformation(ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `Packet<?> createMapDataPacket(ItemStack stack, World worldIn, EntityPlayer player)`
- `protected static void enableMapTracking(ItemStack p_185064_0_, World p_185064_1_)`
- `static int getColor(ItemStack p_190907_0_)`
- `MapData getMapData(ItemStack stack, World worldIn)`
- `static MapData loadMapData(int mapId, World worldIn)`
- `void onCreated(ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `void onUpdate(ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `static void renderBiomePreviewMap(World worldIn, ItemStack map)`
- `protected static void scaleMap(ItemStack p_185063_0_, World p_185063_1_, int p_185063_2_)`
- `static ItemStack setupNewMap(World worldIn, double worldX, double worldZ, byte scale, boolean trackingPosition, boolean unlimitedTracking)`
- `void updateMapData(World worldIn, Entity viewer, MapData data)`

## Fields

- `protected ItemMap`
