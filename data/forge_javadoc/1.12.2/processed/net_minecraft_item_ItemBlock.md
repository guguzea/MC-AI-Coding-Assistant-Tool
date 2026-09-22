# ItemBlock

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemBlock

## Class signature

```java
public class ItemBlock extends Item
```

## Constructors

- `ItemBlock(Block block)`

## Methods

- `void addInformation(ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `Block getBlock()`
- `CreativeTabs getCreativeTab()`
- `void getSubItems(CreativeTabs tab, NonNullList<ItemStack> items)`
- `java.lang.String getUnlocalizedName()`
- `java.lang.String getUnlocalizedName(ItemStack stack)`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `boolean placeBlockAt(ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)` — Called to actually place the block, after the location is determined and all permission checks have been made.
- `static boolean setTileEntityNBT(World worldIn, EntityPlayer player, BlockPos pos, ItemStack stackIn)`

## Fields

- `protected Block block`