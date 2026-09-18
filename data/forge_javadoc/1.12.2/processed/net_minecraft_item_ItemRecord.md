# ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Constructors

- `protected ItemRecord(java.lang.String p_i46742_1_, SoundEvent soundIn)`

## Methods

- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void addInformation( ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `public java.lang.String getRecordNameLocal()`
- `public EnumRarity getRarity( ItemStack stack)`
- `public static ItemRecord getBySound( SoundEvent soundIn)`
- `public SoundEvent getSound()`