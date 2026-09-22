# ItemMonsterPlacer

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemMonsterPlacer

## Class signature

```java
public class ItemMonsterPlacer extends Item
```

## Methods

- `int getColorFromItemStack(ItemStack stack, int renderPass)`
- `static java.lang.String getEntityName(ItemStack stack)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item
- `@Deprecated static Entity spawnCreature(World worldIn, int entityID, double x, double y, double z)`
- `static Entity spawnCreature(World worldIn, java.lang.String name, double x, double y, double z)`

## Fields

- `ItemMonsterPlacer`