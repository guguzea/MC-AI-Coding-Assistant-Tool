# ItemBucketMilk

## Class signature

```java
public class ItemBucketMilk extends Item
```

## Constructors

- `public ItemBucketMilk()`

## Methods

- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.