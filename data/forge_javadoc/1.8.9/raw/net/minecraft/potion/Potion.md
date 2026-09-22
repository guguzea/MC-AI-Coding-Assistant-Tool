---
title: "Potion"
description: "public class Potion extends java.lang.Object"
package: "net/minecraft/potion"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/potion/Potion.html"
sourceType: javadoc
---

# Potion

**Inheritance:** java.lang.Object → net.minecraft.potion.Potion

## Class signature

```java
public class Potion extends java.lang.Object
```

## Constructors

- `@Deprecated Potion(int potionID, ResourceLocation location, boolean badEffect, int potionColor)`
- `Potion(ResourceLocation location, boolean badEffect, int potionColor)`

## Methods

- `void affectEntity(Entity p_180793_1_, Entity p_180793_2_, EntityLivingBase entityLivingBaseIn, int p_180793_4_, double p_180793_5_)`
- `void applyAttributesModifiersToEntity(EntityLivingBase entityLivingBaseIn, BaseAttributeMap p_111185_2_, int amplifier)`
- `double getAttributeModifierAmount(int p_111183_1_, AttributeModifier modifier)`
- `java.util.Map<IAttribute, AttributeModifier> getAttributeModifierMap()`
- `static java.lang.String getDurationString(PotionEffect effect)`
- `double getEffectiveness()`
- `int getId()` — returns the ID of the potion
- `int getLiquidColor()` — Returns the color of the potion liquid.
- `java.lang.String getName()` — returns the name of the potion
- `static Potion getPotionFromResourceLocation(java.lang.String location)`
- `static java.util.Set<ResourceLocation> getPotionLocations()`
- `int getStatusIconIndex()` — Returns the index for the icon to display when the potion is active.
- `boolean hasStatusIcon()` — Returns true if the potion has a associated status icon to display in then inventory when active.
- `boolean isBadEffect()` — This method returns true if the potion effect is bad - negative - for the entity.
- `boolean isInstant()` — Returns true if the potion has an instant effect instead of a continuous one (eg Harming)
- `boolean isReady(int p_76397_1_, int p_76397_2_)` — checks if Potion effect is ready to be applied this tick.
- `boolean isUsable()`
- `void performEffect(EntityLivingBase entityLivingBaseIn, int p_76394_2_)`
- `Potion registerPotionAttributeModifier(IAttribute p_111184_1_, java.lang.String p_111184_2_, double p_111184_3_, int p_111184_5_)` — Used by potions to register the attribute they modify.
- `void removeAttributesModifiersFromEntity(EntityLivingBase entityLivingBaseIn, BaseAttributeMap p_111187_2_, int amplifier)`
- `void renderInventoryEffect(int x, int y, PotionEffect effect, Minecraft mc)` — Called to draw the this Potion onto the player's inventory when it's active.
- `protected Potion setEffectiveness(double effectivenessIn)`
- `protected Potion setIconIndex(int p_76399_1_, int p_76399_2_)` — Sets the index for the icon displayed in the player's inventory when the status is active.
- `Potion setPotionName(java.lang.String nameIn)` — Set the potion name.
- `boolean shouldRender(PotionEffect effect)` — If the Potion effect should be displayed in the players inventory
- `boolean shouldRenderInvText(PotionEffect effect)` — If the standard PotionEffect text (name and duration) should be drawn when this potion is active.

## Fields

- `static Potion absorption` — The absorption Potion object.
- `static Potion blindness` — The blindness Potion object.
- `static Potion confusion`
- `static Potion damageBoost`
- `static Potion digSlowdown`
- `static Potion digSpeed`
- `static Potion field_180143_D`
- `static Potion field_180144_E`
- `static Potion field_180145_F`
- `static Potion field_180146_G`
- `static Potion field_180147_A`
- `static Potion field_180148_B`
- `static Potion field_180149_C`
- `static Potion field_180151_b`
- `static Potion field_180153_z`
- `static Potion fireResistance` — The fire resistance Potion object.
- `static Potion harm`
- `static Potion heal`
- `static Potion healthBoost` — The health boost Potion object.
- `static Potion hunger` — The hunger Potion object.
- `int id` — The Id of a Potion object.
- `static Potion invisibility` — The invisibility Potion object.
- `static Potion jump`
- `static Potion moveSlowdown`
- `static Potion moveSpeed`
- `static Potion nightVision` — The night vision Potion object.
- `static Potion poison` — The poison Potion object.
- `static Potion [] potionTypes` — The array of potion types.
- `static Potion regeneration` — The regeneration Potion object.
- `static Potion resistance`
- `static Potion saturation` — The saturation Potion object.
- `static Potion waterBreathing` — The water breathing Potion object.
- `static Potion weakness` — The weakness Potion object.
- `static Potion wither` — The wither Potion object.
