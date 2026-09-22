# ItemFluidContainer

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraftforge.fluids.ItemFluidContainer

## Class signature

```java
public class ItemFluidContainer extends Item implements IFluidContainerItem
```

## Constructors

- `ItemFluidContainer(int itemID)`
- `ItemFluidContainer(int itemID, int capacity)`

## Methods

- `FluidStack drain(ItemStack container, int maxDrain, boolean doDrain)`
- `int fill(ItemStack container, FluidStack resource, boolean doFill)`
- `int getCapacity(ItemStack container)`
- `FluidStack getFluid(ItemStack container)`
- `ItemFluidContainer setCapacity(int capacity)`

## Fields

- `protected int capacity`