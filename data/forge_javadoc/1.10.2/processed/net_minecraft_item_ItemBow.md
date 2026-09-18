# ItemBow

## Class signature

```java
public class ItemBow extends Item
```

## Constructors

- `public ItemBow()`

## Methods

- `protected boolean isArrow(@Nullable ItemStack stack)`
- `public void onPlayerStoppedUsing( ItemStack stack, World worldIn, EntityLivingBase entityLiving, int timeLeft)`
- `public static float getArrowVelocity(int charge)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public int getItemEnchantability()`