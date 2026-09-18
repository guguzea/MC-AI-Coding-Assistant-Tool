# ItemMonsterPlacer

## Class signature

```java
public class ItemMonsterPlacer extends Item
```

## Constructors

- `public ItemMonsterPlacer()`

## Methods

- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected double getYOffset( World p_190909_1_, BlockPos p_190909_2_)`
- `public static void applyItemEntityDataToEntity( World entityWorld, EntityPlayer player, ItemStack stack, Entity targetEntity)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public static Entity spawnCreature( World worldIn, ResourceLocation entityID, double x, double y, double z)`
- `public void getSubItems( CreativeTabs tab, NonNullList < ItemStack > items)`
- `public static void applyEntityIdToItemStack( ItemStack stack, ResourceLocation entityId)`
- `public static ResourceLocation getNamedIdFrom( ItemStack stack)`