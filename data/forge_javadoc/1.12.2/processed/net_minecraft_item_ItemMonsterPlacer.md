# ItemMonsterPlacer

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemMonsterPlacer

## Class signature

```java
public class ItemMonsterPlacer extends Item
```

## Methods

- `static void applyEntityIdToItemStack(ItemStack stack, ResourceLocation entityId)`
- `static void applyItemEntityDataToEntity(World entityWorld, EntityPlayer player, ItemStack stack, Entity targetEntity)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `static ResourceLocation getNamedIdFrom(ItemStack stack)`
- `void getSubItems(CreativeTabs tab, NonNullList<ItemStack> items)`
- `protected double getYOffset(World p_190909_1_, BlockPos p_190909_2_)`
- `ActionResult<ItemStack> onItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `static Entity spawnCreature(World worldIn, ResourceLocation entityID, double x, double y, double z)`

## Fields

- `ItemMonsterPlacer`