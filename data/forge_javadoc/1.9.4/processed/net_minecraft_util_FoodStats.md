# FoodStats

**Inheritance:** java.lang.Object → net.minecraft.util.FoodStats

## Class signature

```java
public class FoodStats extends java.lang.Object
```

## Constructors

- `FoodStats()`

## Methods

- `void addExhaustion(float exhaustion)`
- `void addStats(int foodLevelIn, float foodSaturationModifier)`
- `void addStats(ItemFood foodItem, ItemStack stack)`
- `int getFoodLevel()`
- `int getPrevFoodLevel()`
- `float getSaturationLevel()`
- `boolean needFood()`
- `void onUpdate(EntityPlayer player)`
- `void readNBT(NBTTagCompound compound)`
- `void setFoodLevel(int foodLevelIn)`
- `void setFoodSaturationLevel(float foodSaturationLevelIn)`
- `void writeNBT(NBTTagCompound compound)`