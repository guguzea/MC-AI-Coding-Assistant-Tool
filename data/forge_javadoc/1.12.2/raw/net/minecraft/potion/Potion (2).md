---
title: "Potion"
description: "Get a fresh list of items that can cure this Potion."
package: "net/minecraft/potion"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/potion/Potion.html"
sourceType: javadoc
---

# Potion

## Class signature

```java
public class Potion extends IForgeRegistryEntry.Impl < Potion >
```

## Constructors

- `protected Potion(boolean isBadEffectIn, int liquidColorIn)`

## Methods

- `public static Potion getPotionById(int potionID)`
- `public static int getIdFromPotion( Potion potionIn)`
- `public static Potion getPotionFromResourceLocation(java.lang.String location)`
- `protected Potion setIconIndex(int p_76399_1_, int p_76399_2_)`
- `public void performEffect( EntityLivingBase entityLivingBaseIn, int amplifier)`
- `public void affectEntity( Entity source, Entity indirectSource, EntityLivingBase entityLivingBaseIn, int amplifier, double health)`
- `public boolean isReady(int duration, int amplifier)`
- `public boolean isInstant()`
- `public Potion setPotionName(java.lang.String nameIn)`
- `public java.lang.String getName()`
- `protected Potion setEffectiveness(double effectivenessIn)`
- `public boolean hasStatusIcon()`
- `public int getStatusIconIndex()`
- `public boolean isBadEffect()`
- `public static java.lang.String getPotionDurationString( PotionEffect effect, float durationFactor)`
- `public int getLiquidColor()`
- `public Potion registerPotionAttributeModifier( IAttribute attribute, java.lang.String uniqueId, double ammount, int operation)`
- `public void removeAttributesModifiersFromEntity( EntityLivingBase entityLivingBaseIn, AbstractAttributeMap attributeMapIn, int amplifier)`
- `public java.util.Map< IAttribute , AttributeModifier > getAttributeModifierMap()`
- `public void applyAttributesModifiersToEntity( EntityLivingBase entityLivingBaseIn, AbstractAttributeMap attributeMapIn, int amplifier)`
- `public double getAttributeModifierAmount(int amplifier, AttributeModifier modifier)`
- `public boolean shouldRender( PotionEffect effect)`
- `public boolean shouldRenderInvText( PotionEffect effect)`
- `public boolean shouldRenderHUD( PotionEffect effect)`
- `@Deprecated public void renderInventoryEffect(int x, int y, PotionEffect effect, Minecraft mc)`
- `public void renderInventoryEffect( PotionEffect effect, Gui gui, int x, int y, float z)`
- `@Deprecated public void renderHUDEffect(int x, int y, PotionEffect effect, Minecraft mc, float alpha)`
- `public void renderHUDEffect( PotionEffect effect, Gui gui, int x, int y, float z, float alpha)`
- `public java.util.List< ItemStack > getCurativeItems()`
- `public int getGuiSortColor( PotionEffect potionEffect)`
- `public boolean isBeneficial()`
- `public Potion setBeneficial()`
- `public static void registerPotions()`

## Description

Get a fresh list of items that can cure this Potion.
