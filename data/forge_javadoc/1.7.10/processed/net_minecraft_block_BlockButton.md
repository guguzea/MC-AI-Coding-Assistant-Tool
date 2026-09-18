# BlockButton

## Class signature

```java
public abstract class BlockButton extends Block
```

## Constructors

- `protected BlockButton(boolean p_i45396_1_)`

## Methods

- `public AxisAlignedBB getCollisionBoundingBoxFromPool( World p_149668_1_, int p_149668_2_, int p_149668_3_, int p_149668_4_)`
- `public int tickRate( World p_149738_1_)`
- `public boolean isOpaqueCube()`
- `public boolean renderAsNormalBlock()`
- `public boolean canPlaceBlockOnSide( World p_149707_1_, int p_149707_2_, int p_149707_3_, int p_149707_4_, int p_149707_5_)`
- `public boolean canPlaceBlockAt( World p_149742_1_, int p_149742_2_, int p_149742_3_, int p_149742_4_)`
- `public int onBlockPlaced( World p_149660_1_, int p_149660_2_, int p_149660_3_, int p_149660_4_, int p_149660_5_, float p_149660_6_, float p_149660_7_, float p_149660_8_, int p_149660_9_)`
- `public void onNeighborBlockChange( World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `public void setBlockBoundsBasedOnState( IBlockAccess p_149719_1_, int p_149719_2_, int p_149719_3_, int p_149719_4_)`
- `public void onBlockClicked( World p_149699_1_, int p_149699_2_, int p_149699_3_, int p_149699_4_, EntityPlayer p_149699_5_)`
- `public boolean onBlockActivated( World p_149727_1_, int p_149727_2_, int p_149727_3_, int p_149727_4_, EntityPlayer p_149727_5_, int p_149727_6_, float p_149727_7_, float p_149727_8_, float p_149727_9_)`
- `public void breakBlock( World p_149749_1_, int p_149749_2_, int p_149749_3_, int p_149749_4_, Block p_149749_5_, int p_149749_6_)`
- `public int isProvidingWeakPower( IBlockAccess p_149709_1_, int p_149709_2_, int p_149709_3_, int p_149709_4_, int p_149709_5_)`
- `public int isProvidingStrongPower( IBlockAccess p_149748_1_, int p_149748_2_, int p_149748_3_, int p_149748_4_, int p_149748_5_)`
- `public boolean canProvidePower()`
- `public void updateTick( World p_149674_1_, int p_149674_2_, int p_149674_3_, int p_149674_4_, java.util.Random p_149674_5_)`
- `public void setBlockBoundsForItemRender()`
- `public void onEntityCollidedWithBlock( World p_149670_1_, int p_149670_2_, int p_149670_3_, int p_149670_4_, Entity p_149670_5_)`
- `public void registerBlockIcons( IIconRegister p_149651_1_)`