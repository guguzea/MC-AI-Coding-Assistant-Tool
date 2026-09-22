# ItemBucketMilk

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemBucketMilk

## Class signature

```java
public class ItemBucketMilk extends Item
```

## Methods

- `EnumAction getItemUseAction(ItemStack stack)`
- `int getMaxItemUseDuration(ItemStack stack)`
- `ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)` — Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
- `ActionResult<ItemStack> onItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityLivingBase entityLiving)`

## Fields

- `ItemBucketMilk`