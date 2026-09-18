# ItemFishFood.FishType

## Methods

- `public static ItemFishFood.FishType [] values()`
- `public static ItemFishFood.FishType valueOf(java.lang.String name)`
- `public int getMetadata()`
- `public java.lang.String getUnlocalizedName()`
- `public int getUncookedHealAmount()`
- `public float getUncookedSaturationModifier()`
- `public int getCookedHealAmount()`
- `public float getCookedSaturationModifier()`
- `public boolean canCook()`
- `public static ItemFishFood.FishType byMetadata(int meta)`
- `public static ItemFishFood.FishType byItemStack( ItemStack stack)`

## Description

Gets the FishType that corresponds to the given ItemStack, defaulting to COD if the given ItemStack does not actually contain a fish.