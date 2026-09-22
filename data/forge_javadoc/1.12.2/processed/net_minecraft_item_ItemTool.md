# ItemTool

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemTool

## Class signature

```java
public class ItemTool extends Item
```

## Constructors

- `ItemTool(float attackDamageIn, float attackSpeedIn, Item.ToolMaterial materialIn, java.util.Set<Block> effectiveBlocksIn)`
- `ItemTool(Item.ToolMaterial materialIn, java.util.Set<Block> effectiveBlocksIn)`

## Methods

- `float getDestroySpeed(ItemStack stack, IBlockState state)`
- `int getHarvestLevel(ItemStack stack, java.lang.String toolClass, EntityPlayer player, IBlockState blockState)` — Queries the harvest level of this item stack for the specified tool class, Returns -1 if this tool is not of the specified type
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)`
- `<any> getItemAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `int getItemEnchantability()`
- `java.util.Set<java.lang.String> getToolClasses(ItemStack stack)`
- `java.lang.String getToolMaterialName()`
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `boolean isFull3D()`
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`

## Fields

- `protected float attackDamage`
- `protected float attackSpeed`
- `protected float efficiency`
- `protected Item.ToolMaterial toolMaterial`