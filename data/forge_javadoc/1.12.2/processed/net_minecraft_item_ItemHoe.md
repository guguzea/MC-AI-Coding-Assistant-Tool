# ItemHoe

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemHoe

## Class signature

```java
public class ItemHoe extends Item
```

## Constructors

- `ItemHoe(Item.ToolMaterial material)`

## Methods

- `<any> getItemAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `java.lang.String getMaterialName()`
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `boolean isFull3D()`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected void setBlock(ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos, IBlockState state)`

## Fields

- `protected Item.ToolMaterial toolMaterial`