# ItemFluidContainer

## Class signature

```java
public class ItemFluidContainer extends Item
```

## Constructors

- `public ItemFluidContainer(int capacity)`

## Methods

- `public ICapabilityProvider initCapabilities(@Nonnull ItemStack stack, @Nullable NBTTagCompound nbt)`

## Description

A simple fluid container, to replace the functionality of the old FluidContainerRegistry and IFluidContainerItem. This fluid container may be set so that is can only completely filled or empty. (binar