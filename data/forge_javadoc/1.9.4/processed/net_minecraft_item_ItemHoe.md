# ItemHoe

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemHoe

## Class signature

```java
public class ItemHoe extends Item
```

## Constructors

- `ItemHoe(Item.ToolMaterial material)`

## Methods

- `com.google.common.collect.Multimap<java.lang.String, AttributeModifier> getItemAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `java.lang.String getMaterialName()`
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `boolean isFull3D()`
- `EnumActionResult onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected void setBlock(ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos, IBlockState state)`

## Fields

- `protected Item.ToolMaterial theToolMaterial`