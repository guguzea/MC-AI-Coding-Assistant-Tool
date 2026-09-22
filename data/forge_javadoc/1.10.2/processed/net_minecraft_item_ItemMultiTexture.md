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