# ItemFood

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemFood

## Class signature

```java
public class ItemFood extends Item
```

## Constructors

- `ItemFood(int amount, boolean isWolfFood)`
- `ItemFood(int amount, float saturation, boolean isWolfFood)`

## Methods

- `int getHealAmount(ItemStack stack)`
- `EnumAction getItemUseAction(ItemStack stack)`
- `int getMaxItemUseDuration(ItemStack stack)`
- `float getSaturationModifier(ItemStack stack)`
- `boolean isWolfsFavoriteMeat()`
- `protected void onFoodEaten(ItemStack stack, World worldIn, EntityPlayer player)`
- `ActionResult<ItemStack> onItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `ItemFood setAlwaysEdible()`
- `ItemFood setPotionEffect(PotionEffect effect, float probability)`

## Fields

- `int itemUseDuration`