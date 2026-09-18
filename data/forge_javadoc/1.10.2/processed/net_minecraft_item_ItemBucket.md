# ItemBucket

## Class signature

```java
public class ItemBucket extends Item
```

## Constructors

- `public ItemBucket( Block containedBlockIn)`

## Methods

- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public boolean tryPlaceContainedLiquid(@Nullable EntityPlayer player, World worldIn, BlockPos posIn)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.