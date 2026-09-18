# ItemHoe

## Class signature

```java
public class ItemHoe extends Item
```

## Constructors

- `public ItemHoe( Item.ToolMaterial material)`

## Methods

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `protected void setBlock( ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isFull3D()`
- `public java.lang.String getMaterialName()`
- `public com.google.common.collect.Multimap<java.lang.String, AttributeModifier > getItemAttributeModifiers( EntityEquipmentSlot equipmentSlot)`