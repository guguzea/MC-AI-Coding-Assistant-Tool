# FoodStats

## Class signature

```java
public class FoodStats extends java.lang.Object
```

## Constructors

- `public FoodStats()`

## Methods

- `public void addStats(int foodLevelIn, float foodSaturationModifier)`
- `public void addStats( ItemFood foodItem, ItemStack stack)`
- `public void onUpdate( EntityPlayer player)`
- `public void readNBT( NBTTagCompound compound)`
- `public void writeNBT( NBTTagCompound compound)`
- `public int getFoodLevel()`
- `public int getPrevFoodLevel()`
- `public boolean needFood()`
- `public void addExhaustion(float exhaustion)`
- `public float getSaturationLevel()`
- `public void setFoodLevel(int foodLevelIn)`
- `public void setFoodSaturationLevel(float foodSaturationLevelIn)`