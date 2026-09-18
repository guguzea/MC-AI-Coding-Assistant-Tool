# ItemShield

## Class signature

```java
public class ItemShield extends Item
```

## Constructors

- `public ItemShield()`

## Methods

- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public void addInformation( ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`