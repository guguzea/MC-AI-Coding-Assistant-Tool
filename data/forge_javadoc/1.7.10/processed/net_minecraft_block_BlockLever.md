# BlockLever

## Class signature

```java
public class BlockLever extends Block
```

## Constructors

- `protected BlockLever()`

## Methods

- `public AxisAlignedBB getCollisionBoundingBoxFromPool( World p_149668_1_, int p_149668_2_, int p_149668_3_, int p_149668_4_)`
- `public boolean isOpaqueCube()`
- `public boolean renderAsNormalBlock()`
- `public int getRenderType()`
- `public boolean canPlaceBlockOnSide( World p_149707_1_, int p_149707_2_, int p_149707_3_, int p_149707_4_, int p_149707_5_)`
- `public boolean canPlaceBlockAt( World p_149742_1_, int p_149742_2_, int p_149742_3_, int p_149742_4_)`
- `public int onBlockPlaced( World p_149660_1_, int p_149660_2_, int p_149660_3_, int p_149660_4_, int p_149660_5_, float p_149660_6_, float p_149660_7_, float p_149660_8_, int p_149660_9_)`
- `public void onBlockPlacedBy( World p_149689_1_, int p_149689_2_, int p_149689_3_, int p_149689_4_, EntityLivingBase p_149689_5_, ItemStack p_149689_6_)`
- `public static int invertMetadata(int p_149819_0_)`
- `public void onNeighborBlockChange( World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `public void setBlockBoundsBasedOnState( IBlockAccess p_149719_1_, int p_149719_2_, int p_149719_3_, int p_149719_4_)`
- `public boolean onBlockActivated( World p_149727_1_, int p_149727_2_, int p_149727_3_, int p_149727_4_, EntityPlayer p_149727_5_, int p_149727_6_, float p_149727_7_, float p_149727_8_, float p_149727_9_)`
- `public void breakBlock( World p_149749_1_, int p_149749_2_, int p_149749_3_, int p_149749_4_, Block p_149749_5_, int p_149749_6_)`
- `public int isProvidingWeakPower( IBlockAccess p_149709_1_, int p_149709_2_, int p_149709_3_, int p_149709_4_, int p_149709_5_)`
- `public int isProvidingStrongPower( IBlockAccess p_149748_1_, int p_149748_2_, int p_149748_3_, int p_149748_4_, int p_149748_5_)`
- `public boolean canProvidePower()`