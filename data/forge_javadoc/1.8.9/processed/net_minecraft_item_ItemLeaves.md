# ItemLeaves

## Class signature

```java
public class ItemLeaves extends ItemBlock
```

## Constructors

- `public ItemLeaves( BlockLeaves block)`

## Methods

- `public int getMetadata(int damage)`
- `public int getColorFromItemStack( ItemStack stack, int renderPass)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).