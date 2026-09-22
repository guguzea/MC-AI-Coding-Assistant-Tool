# ItemArmor

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemArmor

## Class signature

```java
public class ItemArmor extends Item
```

## Constructors

- `ItemArmor(ItemArmor.ArmorMaterial material, int renderIndex, int armorType)`

## Methods

- `ItemArmor.ArmorMaterial getArmorMaterial()` — Return the armor material for this armor item.
- `int getColor(ItemStack stack)` — Return the color for the specified armor ItemStack.
- `int getColorFromItemStack(ItemStack stack, int renderPass)`
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)` — Return whether this item is repairable in an anvil.
- `int getItemEnchantability()` — Return the enchantability factor of the item, most of the time is based on material.
- `boolean hasColor(ItemStack stack)` — Return whether the specified armor ItemStack has a color.
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `void removeColor(ItemStack stack)` — Remove the color from the specified armor ItemStack.
- `void setColor(ItemStack stack, int color)` — Sets the color of the specified armor ItemStack

## Fields

- `int armorType` — Stores the armor type: 0 is helmet, 1 is plate, 2 is legs and 3 is boots
- `int damageReduceAmount` — Holds the amount of damage that the armor reduces at full durability.
- `static java.lang.String[] EMPTY_SLOT_NAMES`
- `int renderIndex` — Used on RenderPlayer to select the correspondent armor to be rendered on the player: 0 is cloth, 1 is chain, 2 is iron, 3 is diamond and 4 is gold.