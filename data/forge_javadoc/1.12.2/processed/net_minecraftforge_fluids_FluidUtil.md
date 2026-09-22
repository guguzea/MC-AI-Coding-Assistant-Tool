# FluidUtil

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `static void destroyBlockOnFluidPlacement(World world, BlockPos pos)` — Destroys a block when a fluid is placed in the same position.
- `static ItemStack getFilledBucket(FluidStack fluidStack)`
- `static FluidStack getFluidContained(ItemStack container)` — Helper method to get the fluid contained in an itemStack
- `static IFluidHandlerItem getFluidHandler(ItemStack itemStack)` — Helper method to get an IFluidHandlerItem for an itemStack.
- `static IFluidHandler getFluidHandler(World world, BlockPos blockPos, EnumFacing side)` — Helper method to get an IFluidHandler for at a block position.
- `static boolean interactWithFluidHandler(EntityPlayer player, EnumHand hand, IFluidHandler handler)` — Used to handle the common case of a player holding a fluid item and right-clicking on a fluid handler.
- `static boolean interactWithFluidHandler(EntityPlayer player, EnumHand hand, World world, BlockPos pos, EnumFacing side)` — Used to handle the common case of a player holding a fluid item and right-clicking on a fluid handler block.
- `static FluidActionResult tryEmptyContainer(ItemStack container, IFluidHandler fluidDestination, int maxAmount, EntityPlayer player, boolean doDrain)` — Takes a filled container and tries to empty it into the given tank.
- `@Deprecated static FluidActionResult tryEmptyContainerAndStow(ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, EntityPlayer player)` — Deprecated. use tryEmptyContainerAndStow(ItemStack, IFluidHandler, IItemHandler, int, EntityPlayer, boolean)
- `static FluidActionResult tryEmptyContainerAndStow(ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, EntityPlayer player, boolean doDrain)` — Takes an Fluid Container Item, tries to empty it into the fluid handler, and stows it in the given inventory.
- `static FluidActionResult tryFillContainer(ItemStack container, IFluidHandler fluidSource, int maxAmount, EntityPlayer player, boolean doFill)` — Fill a container from the given fluidSource.
- `@Deprecated static FluidActionResult tryFillContainerAndStow(ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, EntityPlayer player)` — Deprecated. use tryFillContainerAndStow(ItemStack, IFluidHandler, IItemHandler, int, EntityPlayer, boolean)
- `static FluidActionResult tryFillContainerAndStow(ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, EntityPlayer player, boolean doFill)` — Takes an Fluid Container Item and tries to fill it from the given tank.
- `static FluidStack tryFluidTransfer(IFluidHandler fluidDestination, IFluidHandler fluidSource, FluidStack resource, boolean doTransfer)` — Fill a destination fluid handler from a source fluid handler using a specific fluid.
- `static FluidStack tryFluidTransfer(IFluidHandler fluidDestination, IFluidHandler fluidSource, int maxAmount, boolean doTransfer)` — Fill a destination fluid handler from a source fluid handler with a max amount.
- `static FluidActionResult tryPickUpFluid(ItemStack emptyContainer, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side)` — Attempts to pick up a fluid in the world and put it in an empty container item.
- `static boolean tryPlaceFluid(EntityPlayer player, World world, BlockPos pos, IFluidHandler fluidSource, FluidStack resource)` — Tries to place a fluid resource into the world as a block and drains the fluidSource.
- `static FluidActionResult tryPlaceFluid(EntityPlayer player, World world, BlockPos pos, ItemStack container, FluidStack resource)` — ItemStack version of tryPlaceFluid(EntityPlayer, World, BlockPos, IFluidHandler, FluidStack) .