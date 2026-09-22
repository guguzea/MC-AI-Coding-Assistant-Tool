# ItemMonsterPlacer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemMonsterPlacer

## Class signature

```java
public class ItemMonsterPlacer extends Item
```

## Methods

- `static void applyEntityIdToItemStack(ItemStack stack, java.lang.String entityId)`
- `static void applyItemEntityDataToEntity(World entityWorld, EntityPlayer player, ItemStack stack, Entity targetEntity)`
- `static java.lang.String getEntityIdFromItem(ItemStack stack)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)`
- `ActionResult<ItemStack> onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `EnumActionResult onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `static Entity spawnCreature(World worldIn, java.lang.String entityID, double x, double y, double z)`

## Fields

- `ItemMonsterPlacer`