# ItemDye

## Class signature

```java
public class ItemDye extends Item
```

## Constructors

- `public ItemDye()`

## Methods

- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public static boolean applyBonemeal( ItemStack stack, World worldIn, BlockPos target)`
- `public static boolean applyBonemeal( ItemStack stack, World worldIn, BlockPos target, EntityPlayer player)`
- `public static void spawnBonemealParticles( World worldIn, BlockPos pos, int amount)`
- `public boolean itemInteractionForEntity( ItemStack stack, EntityPlayer playerIn, EntityLivingBase target, EnumHand hand)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > subItems)`