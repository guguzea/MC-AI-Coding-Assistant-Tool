---
title: "ItemMultiTexture"
description: "public class ItemMultiTexture extends ItemBlock"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemMultiTexture.html"
sourceType: javadoc
---

# ItemMultiTexture

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBlock → net.minecraft.item.ItemMultiTexture

## Class signature

```java
public class ItemMultiTexture extends ItemBlock
```

## Constructors

- `ItemMultiTexture(Block block, Block block2, <any> nameFunction)`

## Methods

- `int getMetadata(int damage)` — Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.

## Fields

- `protected<any> nameFunction`
- `protected Block theBlock`
