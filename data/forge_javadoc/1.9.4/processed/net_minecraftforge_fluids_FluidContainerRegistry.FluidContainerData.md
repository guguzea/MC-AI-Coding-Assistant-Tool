# FluidContainerRegistry.FluidContainerData

## Constructors

- `public FluidContainerData( FluidStack stack, ItemStack filledContainer, ItemStack emptyContainer)`
- `public FluidContainerData( FluidStack stack, ItemStack filledContainer, ItemStack emptyContainer, boolean nullEmpty)`

## Methods

- `public FluidContainerRegistry.FluidContainerData copy()`

## Description

Wrapper class for the registry entries. Ensures that none of the attempted registrations contain null references unless permitted.