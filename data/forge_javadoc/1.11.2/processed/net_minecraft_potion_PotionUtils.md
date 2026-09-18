# PotionUtils

## Class signature

```java
public class PotionUtils extends java.lang.Object
```

## Constructors

- `public PotionUtils()`

## Methods

- `public static java.util.List< PotionEffect > getEffectsFromStack( ItemStack stack)`
- `public static java.util.List< PotionEffect > mergeEffects( PotionType potionIn, java.util.Collection< PotionEffect > effects)`
- `public static java.util.List< PotionEffect > getEffectsFromTag(@Nullable NBTTagCompound tag)`
- `public static java.util.List< PotionEffect > getFullEffectsFromItem( ItemStack itemIn)`
- `public static java.util.List< PotionEffect > getFullEffectsFromTag(@Nullable NBTTagCompound tag)`
- `public static void addCustomPotionEffectToList(@Nullable NBTTagCompound tag, java.util.List< PotionEffect > effectList)`
- `public static int getColor( ItemStack p_190932_0_)`
- `public static int getPotionColor( PotionType potionIn)`
- `public static int getPotionColorFromEffectList(java.util.Collection< PotionEffect > effects)`
- `public static PotionType getPotionFromItem( ItemStack itemIn)`
- `public static PotionType getPotionTypeFromNBT(@Nullable NBTTagCompound tag)`
- `public static ItemStack addPotionToItemStack( ItemStack itemIn, PotionType potionIn)`
- `public static ItemStack appendEffects( ItemStack itemIn, java.util.Collection< PotionEffect > effects)`
- `public static void addPotionTooltip( ItemStack itemIn, java.util.List<java.lang.String> lores, float durationFactor)`