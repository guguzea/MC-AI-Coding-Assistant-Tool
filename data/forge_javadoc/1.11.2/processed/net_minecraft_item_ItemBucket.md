# ItemBucket

## Class signature

```java
public class ItemBucket extends Item
```

## Constructors

- `public ItemBucket( Block containedBlockIn)`

## Methods

- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public boolean tryPlaceContainedLiquid(@Nullable EntityPlayer player, World worldIn, BlockPos posIn)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, @Nullable NBTTagCompound nbt)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.