# PotionEffect

## Class signature

```java
public class PotionEffect extends java.lang.Object
```

## Constructors

- `public PotionEffect(int id, int effectDuration)`
- `public PotionEffect(int id, int effectDuration, int effectAmplifier)`
- `public PotionEffect(int id, int effectDuration, int effectAmplifier, boolean ambient, boolean showParticles)`
- `public PotionEffect( PotionEffect other)`

## Methods

- `public void combine( PotionEffect other)`
- `public int getPotionID()`
- `public int getDuration()`
- `public int getAmplifier()`
- `public void setSplashPotion(boolean splashPotion)`
- `public boolean getIsAmbient()`
- `public boolean getIsShowParticles()`
- `public boolean onUpdate( EntityLivingBase entityIn)`
- `public void performEffect( EntityLivingBase entityIn)`
- `public java.lang.String getEffectName()`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public NBTTagCompound writeCustomPotionEffectToNBT( NBTTagCompound nbt)`
- `public static PotionEffect readCustomPotionEffectFromNBT( NBTTagCompound nbt)`
- `public void setPotionDurationMax(boolean maxDuration)`
- `public boolean getIsPotionDurationMax()`
- `public java.util.List< ItemStack > getCurativeItems()`
- `public boolean isCurativeItem( ItemStack stack)`
- `public void setCurativeItems(java.util.List< ItemStack > curativeItems)`
- `public void addCurativeItem( ItemStack stack)`

## Description

Adds the given stack to list of curative items for the potion effect