# ItemBucket

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemBucket

## Class signature

```java
public class ItemBucket extends Item
```

## Methods

- `ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)` — Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
- `ActionResult<ItemStack> onItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `boolean tryPlaceContainedLiquid(EntityPlayer player, World worldIn, BlockPos posIn)`

## Fields

- `ItemBucket`