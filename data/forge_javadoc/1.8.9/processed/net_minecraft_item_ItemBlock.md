# ItemBlock

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBlock

## Class signature

```java
public class ItemBlock extends Item
```

## Constructors

- `ItemBlock(Block block)`

## Methods

- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `Block getBlock()`
- `CreativeTabs getCreativeTab()` — gets the CreativeTab this item is displayed on
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `java.lang.String getUnlocalizedName()` — Returns the unlocalized name of this item.
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item
- `boolean placeBlockAt(ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)` — Called to actually place the block, after the location is determined and all permission checks have been made.
- `static boolean setTileEntityNBT(World worldIn, EntityPlayer pos, BlockPos stack, ItemStack p_179224_3_)`
- `ItemBlock setUnlocalizedName(java.lang.String unlocalizedName)` — Sets the unlocalized name of this item to the string passed as the parameter, prefixed by "item."

## Fields

- `Block block`