# ItemDye

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemDye

## Class signature

```java
public class ItemDye extends Item
```

## Constructors

- `ItemDye()`

## Methods

- `static boolean applyBonemeal(ItemStack stack, World worldIn, BlockPos target)`
- `static boolean applyBonemeal(ItemStack stack, World worldIn, BlockPos target, EntityPlayer player)`
- `void getSubItems(Item itemIn, CreativeTabs tab, NonNullList<ItemStack> subItems)`
- `java.lang.String getUnlocalizedName(ItemStack stack)`
- `boolean itemInteractionForEntity(ItemStack stack, EntityPlayer playerIn, EntityLivingBase target, EnumHand hand)`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `static void spawnBonemealParticles(World worldIn, BlockPos pos, int amount)`

## Fields

- `static int[] DYE_COLORS`