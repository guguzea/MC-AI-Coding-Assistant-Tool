# ItemBucketMilk

## Class signature

```java
public class ItemBucketMilk extends Item
```

## Constructors

- `public ItemBucketMilk()`

## Methods

- `@Nullable public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.