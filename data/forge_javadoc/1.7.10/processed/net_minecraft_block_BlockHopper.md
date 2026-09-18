# BlockHopper

## Class signature

```java
public class BlockHopper extends BlockContainer
```

## Constructors

- `public BlockHopper()`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess p_149719_1_, int p_149719_2_, int p_149719_3_, int p_149719_4_)`
- `public void addCollisionBoxesToList( World p_149743_1_, int p_149743_2_, int p_149743_3_, int p_149743_4_, AxisAlignedBB p_149743_5_, java.util.List p_149743_6_, Entity p_149743_7_)`
- `public int onBlockPlaced( World p_149660_1_, int p_149660_2_, int p_149660_3_, int p_149660_4_, int p_149660_5_, float p_149660_6_, float p_149660_7_, float p_149660_8_, int p_149660_9_)`
- `public TileEntity createNewTileEntity( World p_149915_1_, int p_149915_2_)`
- `public void onBlockPlacedBy( World p_149689_1_, int p_149689_2_, int p_149689_3_, int p_149689_4_, EntityLivingBase p_149689_5_, ItemStack p_149689_6_)`
- `public void onBlockAdded( World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `public boolean onBlockActivated( World p_149727_1_, int p_149727_2_, int p_149727_3_, int p_149727_4_, EntityPlayer p_149727_5_, int p_149727_6_, float p_149727_7_, float p_149727_8_, float p_149727_9_)`
- `public void onNeighborBlockChange( World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `public void breakBlock( World p_149749_1_, int p_149749_2_, int p_149749_3_, int p_149749_4_, Block p_149749_5_, int p_149749_6_)`
- `public int getRenderType()`
- `public boolean renderAsNormalBlock()`
- `public boolean isOpaqueCube()`
- `public boolean shouldSideBeRendered( IBlockAccess p_149646_1_, int p_149646_2_, int p_149646_3_, int p_149646_4_, int p_149646_5_)`
- `public IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `public static int getDirectionFromMetadata(int p_149918_0_)`
- `public static boolean func_149917_c(int p_149917_0_)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World p_149736_1_, int p_149736_2_, int p_149736_3_, int p_149736_4_, int p_149736_5_)`
- `public void registerBlockIcons( IIconRegister p_149651_1_)`
- `public static IIcon getHopperIcon(java.lang.String p_149916_0_)`
- `public static TileEntityHopper func_149920_e( IBlockAccess p_149920_0_, int p_149920_1_, int p_149920_2_, int p_149920_3_)`
- `public java.lang.String getItemIconName()`