# ItemTool

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemTool

## Class signature

```java
public class ItemTool extends Item
```

## Constructors

- `ItemTool(float attackDamageIn, float attackSpeedIn, Item.ToolMaterial materialIn, java.util.Set<Block> effectiveBlocksIn)`
- `ItemTool(Item.ToolMaterial materialIn, java.util.Set<Block> effectiveBlocksIn)`

## Methods

- `int getHarvestLevel(ItemStack stack, java.lang.String toolClass)` — Queries the harvest level of this item stack for the specifred tool class, Returns -1 if this tool is not of the specified type
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)`
- `com.google.common.collect.Multimap<java.lang.String, AttributeModifier> getItemAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `int getItemEnchantability()`
- `float getStrVsBlock(ItemStack stack, IBlockState state)`
- `java.util.Set<java.lang.String> getToolClasses(ItemStack stack)`
- `Item.ToolMaterial getToolMaterial()`
- `java.lang.String getToolMaterialName()`
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `boolean isFull3D()`
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`

## Fields

- `protected float attackSpeed`
- `protected float damageVsEntity`
- `protected float efficiencyOnProperMaterial`
- `protected Item.ToolMaterial toolMaterial`