---
title: "Potion"
description: "Called to draw the this Potion onto the player's ingame HUD when it's active."
package: "net/minecraft/potion"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/potion/Potion.html"
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

- `@Nullable public static Potion getPotionById(int potionID)`
- `public static int getIdFromPotion( Potion potionIn)`
- `@Nullable public static Potion getPotionFromResourceLocation(java.lang.String location)`
- `protected Potion setIconIndex(int p_76399_1_, int p_76399_2_)`
- `public void performEffect( EntityLivingBase entityLivingBaseIn, int p_76394_2_)`
- `public void affectEntity(@Nullable Entity source, @Nullable Entity indirectSource, EntityLivingBase entityLivingBaseIn, int amplifier, double health)`
- `public boolean isReady(int duration, int amplifier)`
- `public boolean isInstant()`
- `public Potion setPotionName(java.lang.String nameIn)`
- `public java.lang.String getName()`
- `protected Potion setEffectiveness(double effectivenessIn)`
- `public boolean hasStatusIcon()`
- `public int getStatusIconIndex()`
- `public boolean isBadEffect()`
- `public static java.lang.String getPotionDurationString( PotionEffect p_188410_0_, float p_188410_1_)`
- `public int getLiquidColor()`
- `public Potion registerPotionAttributeModifier( IAttribute attribute, java.lang.String uniqueId, double ammount, int operation)`
- `public void removeAttributesModifiersFromEntity( EntityLivingBase entityLivingBaseIn, AbstractAttributeMap attributeMapIn, int amplifier)`
- `public java.util.Map< IAttribute , AttributeModifier > getAttributeModifierMap()`
- `public void applyAttributesModifiersToEntity( EntityLivingBase entityLivingBaseIn, AbstractAttributeMap attributeMapIn, int amplifier)`
- `public double getAttributeModifierAmount(int amplifier, AttributeModifier modifier)`
- `public boolean shouldRender( PotionEffect effect)`
- `public boolean shouldRenderInvText( PotionEffect effect)`
- `public boolean shouldRenderHUD( PotionEffect effect)`
- `public void renderInventoryEffect(int x, int y, PotionEffect effect, Minecraft mc)`
- `public void renderHUDEffect(int x, int y, PotionEffect effect, Minecraft mc, float alpha)`
- `public boolean isBeneficial()`
- `public Potion setBeneficial()`
- `public static void registerPotions()`

## Description

Called to draw the this Potion onto the player's ingame HUD when it's active.
