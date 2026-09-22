# ItemEnchantedBook

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemEnchantedBook

## Class signature

```java
public class ItemEnchantedBook extends Item
```

## Methods

- `void addEnchantment(ItemStack stack, EnchantmentData enchantment)`
- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `void getAll(Enchantment enchantment, java.util.List<ItemStack> list)`
- `ItemStack getEnchantedItemStack(EnchantmentData data)`
- `NBTTagList getEnchantments(ItemStack stack)`
- `EnumRarity getRarity(ItemStack stack)`
- `boolean hasEffect(ItemStack stack)`
- `boolean isEnchantable(ItemStack stack)`

## Fields

- `ItemEnchantedBook`