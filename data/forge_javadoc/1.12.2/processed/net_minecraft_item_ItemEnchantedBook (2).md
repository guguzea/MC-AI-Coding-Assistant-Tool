# ItemEnchantedBook

## Class signature

```java
public class ItemEnchantedBook extends Item
```

## Constructors

- `public ItemEnchantedBook()`

## Methods

- `public boolean hasEffect( ItemStack stack)`
- `public boolean isEnchantable( ItemStack stack)`
- `public EnumRarity getRarity( ItemStack stack)`
- `public static NBTTagList getEnchantments( ItemStack p_92110_0_)`
- `public void addInformation( ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `public static void addEnchantment( ItemStack p_92115_0_, EnchantmentData stack)`
- `public static ItemStack getEnchantedItemStack( EnchantmentData p_92111_0_)`
- `public void getSubItems( CreativeTabs tab, NonNullList < ItemStack > items)`