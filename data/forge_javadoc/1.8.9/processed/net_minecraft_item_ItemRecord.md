# ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Constructors

- `protected ItemRecord(java.lang.String name)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public java.lang.String getRecordNameLocal()`
- `public EnumRarity getRarity( ItemStack stack)`
- `public static ItemRecord getRecord(java.lang.String name)`
- `public ResourceLocation getRecordResource(java.lang.String name)`

## Description

The name of the record.