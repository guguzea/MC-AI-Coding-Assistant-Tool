# ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Constructors

- `protected ItemRecord(java.lang.String p_i46742_1_, SoundEvent soundIn)`

## Methods

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public ResourceLocation getRecordResource(java.lang.String name)`
- `public java.lang.String getRecordNameLocal()`
- `public EnumRarity getRarity( ItemStack stack)`
- `@Nullable public static ItemRecord getBySound( SoundEvent soundIn)`
- `public SoundEvent getSound()`

## Description

Retrieves the resource location of the sound to play for this record.