# BlockRedstoneComparator

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockRedstoneDiode → net.minecraft.block.BlockRedstoneComparator

## Class signature

```java
public class BlockRedstoneComparator extends BlockRedstoneDiode implements ITileEntityProvider
```

## Constructors

- `BlockRedstoneComparator(boolean powered)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected int calculateInputStrength(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockState createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `protected int getActiveSignal(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected int getDelay(IBlockState state)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `protected IBlockState getPoweredState(IBlockState unpoweredState)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected IBlockState getUnpoweredState(IBlockState poweredState)`
- `boolean getWeakChanges(IBlockAccess world, BlockPos pos)` — If this block should be notified of weak changes.
- `protected boolean isPowered(IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `boolean onBlockEventReceived(World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)` — Called on both Client and Server when World#addBlockEvent is called
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onNeighborChange(IBlockAccess world, BlockPos pos, BlockPos neighbor)` — Called when a tile entity on a side of this block changes is created or is destroyed.
- `protected boolean shouldBePowered(World worldIn, BlockPos pos, IBlockState state)`
- `protected void updateState(World worldIn, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyEnum<BlockRedstoneComparator.Mode> MODE`
- `static PropertyBool POWERED`