# ItemBanner

## Class signature

```java
public class ItemBanner extends ItemBlock
```

## Constructors

- `public ItemBanner()`

## Methods

- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public static void appendHoverTextFromTileEntityTag( ItemStack stack, java.util.List<java.lang.String> p_185054_1_)`
- `public void addInformation( ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `public void getSubItems( CreativeTabs tab, NonNullList < ItemStack > items)`
- `public static ItemStack makeBanner( EnumDyeColor p_190910_0_, NBTTagList p_190910_1_)`
- `public CreativeTabs getCreativeTab()`
- `public static EnumDyeColor getBaseColor( ItemStack stack)`