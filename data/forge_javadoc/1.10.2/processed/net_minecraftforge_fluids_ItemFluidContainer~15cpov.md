# ItemFluidContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraftforge.fluids.ItemFluidContainer

## Class signature

```java
public class ItemFluidContainer extends Item implements IFluidContainerItem
```

## Constructors

- `@Deprecated ItemFluidContainer(int itemID)`
- `@Deprecated ItemFluidContainer(int itemID, int capacity)`

## Methods

- `@Deprecated FluidStack drain(ItemStack container, int maxDrain, boolean doDrain)`
- `@Deprecated int fill(ItemStack container, FluidStack resource, boolean doFill)`
- `@Deprecated int getCapacity(ItemStack container)`
- `@Deprecated FluidStack getFluid(ItemStack container)`
- `@Deprecated ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)`
- `@Deprecated ItemFluidContainer setCapacity(int capacity)`

## Fields

- `protected int capacity`