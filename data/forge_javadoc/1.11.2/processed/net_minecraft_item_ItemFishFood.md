# ItemFishFood

## Class signature

```java
public class ItemFishFood extends ItemFood
```

## Constructors

- `public ItemFishFood(boolean cooked)`

## Methods

- `public int getHealAmount( ItemStack stack)`
- `public float getSaturationModifier( ItemStack stack)`
- `protected void onFoodEaten( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > subItems)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`