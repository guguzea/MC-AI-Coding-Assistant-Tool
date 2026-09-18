# Enchantment

## Class signature

```java
public abstract class Enchantment extends IForgeRegistryEntry.Impl < Enchantment >
```

## Constructors

- `protected Enchantment( Enchantment.Rarity rarityIn, EnumEnchantmentType typeIn, EntityEquipmentSlot [] slots)`

## Methods

- `public static Enchantment getEnchantmentByID(int id)`
- `public static int getEnchantmentID( Enchantment enchantmentIn)`
- `public static Enchantment getEnchantmentByLocation(java.lang.String location)`
- `public java.util.List< ItemStack > getEntityEquipment( EntityLivingBase entityIn)`
- `public Enchantment.Rarity getRarity()`
- `public int getMinLevel()`
- `public int getMaxLevel()`
- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int calcModifierDamage(int level, DamageSource source)`
- `public float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `public final boolean isCompatibleWith( Enchantment p_191560_1_)`
- `protected boolean canApplyTogether( Enchantment ench)`
- `public Enchantment setName(java.lang.String enchName)`
- `public java.lang.String getName()`
- `public java.lang.String getTranslatedName(int level)`
- `public boolean canApply( ItemStack stack)`
- `public void onEntityDamaged( EntityLivingBase user, Entity target, int level)`
- `public void onUserHurt( EntityLivingBase user, Entity attacker, int level)`
- `public boolean isTreasureEnchantment()`
- `public boolean isCurse()`
- `public boolean canApplyAtEnchantingTable( ItemStack stack)`
- `public boolean isAllowedOnBooks()`
- `public static void registerEnchantments()`

## Description

This applies specifically to applying at the enchanting table.