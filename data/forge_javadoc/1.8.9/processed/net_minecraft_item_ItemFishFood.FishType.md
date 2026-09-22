# ItemFishFood.FishType

**Inheritance:** java.lang.Object → java.lang.Enum<ItemFishFood.FishType> → net.minecraft.item.ItemFishFood.FishType

## Class signature

```java
public static enum ItemFishFood.FishType extends java.lang.Enum<ItemFishFood.FishType>
```

## Methods

- `static ItemFishFood.FishType byItemStack(ItemStack stack)` — Gets the FishType that corresponds to the given ItemStack, defaulting to COD if the given ItemStack does not actually contain a fish.
- `static ItemFishFood.FishType byMetadata(int meta)` — Gets the corresponding FishType value for the given item damage value of an ItemStack, defaulting to COD for unrecognized damage values.
- `boolean canCook()` — Gets a value indicating whether this type of fish has "raw" and "cooked" variants.
- `int getCookedHealAmount()` — Gets the amount that eating the cooked version of this fish should heal the player.
- `float getCookedSaturationModifier()` — Gets the saturation modifier to apply to the heal amount when the player eats the cooked version of this fish.
- `int getMetadata()` — Gets the item damage value on an ItemStack that represents this fish type
- `int getUncookedHealAmount()` — Gets the amount that eating the uncooked version of this fish should heal the player.
- `float getUncookedSaturationModifier()` — Gets the saturation modifier to apply to the heal amount when the player eats the uncooked version of this fish.
- `java.lang.String getUnlocalizedName()` — Gets the value that this fish type uses to replace "XYZ" in: "fish.XYZ.raw" / "fish.XYZ.cooked" for the unlocalized name and "fish_XYZ_raw" / "fish_XYZ_cooked" for the icon string.
- `static ItemFishFood.FishType valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static ItemFishFood.FishType [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.