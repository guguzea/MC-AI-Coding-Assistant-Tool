# ItemRecord

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `static ItemRecord getBySound(SoundEvent soundIn)`
- `EnumRarity getRarity(ItemStack stack)`
- `java.lang.String getRecordNameLocal()`
- `ResourceLocation getRecordResource(java.lang.String name)` — Retrieves the resource location of the sound to play for this record.
- `SoundEvent getSound()`
- `EnumActionResult onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`

## Fields

- `protected ItemRecord`