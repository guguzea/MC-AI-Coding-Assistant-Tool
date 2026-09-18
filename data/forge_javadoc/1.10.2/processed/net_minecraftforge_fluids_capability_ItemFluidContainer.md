# ItemFluidContainer

## Class signature

```java
public class ItemFluidContainer extends Item
```

## Constructors

- `public ItemFluidContainer(int capacity)`

## Methods

- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

A simple fluid container, to replace the functionality of FluidContainerRegistry) and {@link IFluidContainerItem}. This fluid container may be set so that is can only completely filled or empty. (bina