# ItemPotion

## Class signature

```java
public class ItemPotion extends Item
```

## Constructors

- `public ItemPotion()`

## Methods

- `@Nullable public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public boolean hasEffect( ItemStack stack)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`