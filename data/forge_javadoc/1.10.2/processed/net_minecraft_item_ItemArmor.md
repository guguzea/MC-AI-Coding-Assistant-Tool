# ItemArmor

## Class signature

```java
public class ItemArmor extends Item
```

## Constructors

- `public ItemArmor( ItemArmor.ArmorMaterial materialIn, int renderIndexIn, EntityEquipmentSlot equipmentSlotIn)`

## Methods

- `public static ItemStack dispenseArmor( IBlockSource blockSource, ItemStack stack)`
- `public EntityEquipmentSlot getEquipmentSlot()`
- `public int getItemEnchantability()`
- `public ItemArmor.ArmorMaterial getArmorMaterial()`
- `public boolean hasColor( ItemStack stack)`
- `public int getColor( ItemStack stack)`
- `public void removeColor( ItemStack stack)`
- `public void setColor( ItemStack stack, int color)`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public com.google.common.collect.Multimap<java.lang.String, AttributeModifier > getItemAttributeModifiers( EntityEquipmentSlot equipmentSlot)`
- `public boolean hasOverlay( ItemStack stack)`

## Description

Determines if this armor will be rendered with the secondary 'overlay' texture.