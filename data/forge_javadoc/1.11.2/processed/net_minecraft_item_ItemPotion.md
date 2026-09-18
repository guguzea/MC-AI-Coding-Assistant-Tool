# ItemPotion

## Class signature

```java
public class ItemPotion extends Item
```

## Constructors

- `public ItemPotion()`

## Methods

- `public ItemStack getDefaultInstance()`
- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public boolean hasEffect( ItemStack stack)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > subItems)`