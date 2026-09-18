# ItemSword

## Class signature

```java
public class ItemSword extends Item
```

## Constructors

- `public ItemSword( Item.ToolMaterial material)`

## Methods

- `public float getAttackDamage()`
- `public float getDestroySpeed( ItemStack stack, IBlockState state)`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `public boolean canHarvestBlock( IBlockState blockIn)`
- `public boolean isFull3D()`
- `public int getItemEnchantability()`
- `public java.lang.String getToolMaterialName()`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public <any> getItemAttributeModifiers( EntityEquipmentSlot equipmentSlot)`