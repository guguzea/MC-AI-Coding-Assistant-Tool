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