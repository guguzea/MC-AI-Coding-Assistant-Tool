# ItemBanner

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBlock → net.minecraft.item.ItemBanner

## Class signature

```java
public class ItemBanner extends ItemBlock
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `int getColorFromItemStack(ItemStack stack, int renderPass)`
- `CreativeTabs getCreativeTab()` — gets the CreativeTab this item is displayed on
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item

## Fields

- `ItemBanner`