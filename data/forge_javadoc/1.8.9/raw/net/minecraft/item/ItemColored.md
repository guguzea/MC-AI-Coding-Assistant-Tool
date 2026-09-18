---
title: "ItemColored"
description: "Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks)."
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemColored.html"
sourceType: javadoc
---

# ItemColored

## Class signature

```java
public class ItemColored extends ItemBlock
```

## Constructors

- `public ItemColored( Block block, boolean hasSubtypes)`

## Methods

- `public int getColorFromItemStack( ItemStack stack, int renderPass)`
- `public int getMetadata(int damage)`
- `public ItemColored setSubtypeNames(java.lang.String[] names)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
