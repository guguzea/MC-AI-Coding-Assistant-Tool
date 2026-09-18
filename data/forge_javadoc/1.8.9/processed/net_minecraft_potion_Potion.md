# Potion

## Class signature

```java
public class Potion extends java.lang.Object
```

## Constructors

- `protected Potion( ResourceLocation location, boolean badEffect, int potionColor)`

## Methods

- `@Deprecated protected Potion(int potionID, ResourceLocation location, boolean badEffect, int potionColor)`
- `public static Potion getPotionFromResourceLocation(java.lang.String location)`
- `public static java.util.Set< ResourceLocation > getPotionLocations()`
- `protected Potion setIconIndex(int p_76399_1_, int p_76399_2_)`
- `public int getId()`
- `public void performEffect( EntityLivingBase entityLivingBaseIn, int p_76394_2_)`
- `public void affectEntity( Entity p_180793_1_, Entity p_180793_2_, EntityLivingBase entityLivingBaseIn, int p_180793_4_, double p_180793_5_)`
- `public boolean isInstant()`
- `public boolean isReady(int p_76397_1_, int p_76397_2_)`
- `public Potion setPotionName(java.lang.String nameIn)`
- `public java.lang.String getName()`
- `protected Potion setEffectiveness(double effectivenessIn)`
- `public boolean hasStatusIcon()`
- `public int getStatusIconIndex()`
- `public boolean isBadEffect()`
- `public static java.lang.String getDurationString( PotionEffect effect)`
- `public double getEffectiveness()`
- `public boolean isUsable()`
- `public int getLiquidColor()`
- `public Potion registerPotionAttributeModifier( IAttribute p_111184_1_, java.lang.String p_111184_2_, double p_111184_3_, int p_111184_5_)`
- `public void removeAttributesModifiersFromEntity( EntityLivingBase entityLivingBaseIn, BaseAttributeMap p_111187_2_, int amplifier)`
- `public java.util.Map< IAttribute , AttributeModifier > getAttributeModifierMap()`
- `public void applyAttributesModifiersToEntity( EntityLivingBase entityLivingBaseIn, BaseAttributeMap p_111185_2_, int amplifier)`
- `public double getAttributeModifierAmount(int p_111183_1_, AttributeModifier modifier)`
- `public boolean shouldRender( PotionEffect effect)`
- `public boolean shouldRenderInvText( PotionEffect effect)`
- `public void renderInventoryEffect(int x, int y, PotionEffect effect, Minecraft mc)`

## Description

The absorption Potion object.