# ItemBanner

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemBlock → net.minecraft.item.ItemBanner

## Class signature

```java
public class ItemBanner extends ItemBlock
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `static void appendHoverTextFromTileEntityTag(ItemStack stack, java.util.List<java.lang.String> p_185054_1_)`
- `static EnumDyeColor getBaseColor(ItemStack stack)`
- `CreativeTabs getCreativeTab()`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, NonNullList<ItemStack> subItems)`
- `static ItemStack makeBanner(EnumDyeColor p_190910_0_, NBTTagList p_190910_1_)`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`

## Fields

- `ItemBanner`