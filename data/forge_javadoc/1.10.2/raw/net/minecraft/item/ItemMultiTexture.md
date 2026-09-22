---
title: "ItemMultiTexture"
description: "public class ItemMultiTexture extends ItemBlock"
package: "net/minecraft/item"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemMultiTexture.html"
sourceType: javadoc
---

# ItemMultiTexture

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemBlock → net.minecraft.item.ItemMultiTexture

## Class signature

```java
public class ItemMultiTexture extends ItemBlock
```

## Constructors

- `ItemMultiTexture(Block block, Block block2, com.google.common.base.Function<ItemStack, java.lang.String> nameFunction)`
- `ItemMultiTexture(Block block, Block block2, java.lang.String[] namesByMeta)`

## Methods

- `int getMetadata(int damage)`
- `java.lang.String getUnlocalizedName(ItemStack stack)`

## Fields

- `protected com.google.common.base.Function<ItemStack, java.lang.String> nameFunction`
- `protected Block theBlock`
