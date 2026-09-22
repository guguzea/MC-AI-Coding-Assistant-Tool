# ItemFood

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemFood

## Class signature

```java
public class ItemFood extends Item
```

## Constructors

- `ItemFood(int amount, boolean isWolfFood)`
- `ItemFood(int amount, float saturation, boolean isWolfFood)`

## Methods

- `int getHealAmount(ItemStack stack)`
- `EnumAction getItemUseAction(ItemStack stack)` — returns the action that specifies what animation to play when the items is being used
- `int getMaxItemUseDuration(ItemStack stack)` — How long it takes to use or consume an item
- `float getSaturationModifier(ItemStack stack)`
- `boolean isWolfsFavoriteMeat()` — Whether wolves like this food (true for raw and cooked porkchop).
- `protected void onFoodEaten(ItemStack stack, World worldIn, EntityPlayer player)`
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when the player finishes using this Item (E.g. finishes eating.).
- `ItemFood setAlwaysEdible()` — Set the field 'alwaysEdible' to true, and make the food edible even if the player don't need to eat.
- `ItemFood setPotionEffect(int id, int duration, int amplifier, float probability)` — sets a potion effect on the item.

## Fields

- `int itemUseDuration` — Number of ticks to run while 'EnumAction'ing until result.