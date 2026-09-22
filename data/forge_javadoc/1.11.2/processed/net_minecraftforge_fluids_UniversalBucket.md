# UniversalBucket

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraftforge.fluids.UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item
```

## Methods

- `int getCapacity()`
- `ItemStack getContainerItem(ItemStack itemStack)` — ItemStack sensitive version of getContainerItem.
- `ItemStack getEmpty()`
- `static ItemStack getFilledBucket(UniversalBucket item, Fluid fluid)`
- `FluidStack getFluid(ItemStack container)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, NonNullList<ItemStack> subItems)`
- `boolean hasContainerItem(ItemStack stack)` — ItemStack sensitive version of hasContainerItem
- `ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)` — Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
- `boolean isNbtSensitive()`
- `void onFillBucket(FillBucketEvent event)`
- `ActionResult<ItemStack> onItemRightClick(World world, EntityPlayer player, EnumHand hand)`

## Fields

- `UniversalBucket`
- `UniversalBucket`