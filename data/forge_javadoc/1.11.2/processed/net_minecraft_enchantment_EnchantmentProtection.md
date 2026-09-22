# EnchantmentProtection

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Enchantment> → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentProtection

## Class signature

```java
public class EnchantmentProtection extends Enchantment
```

## Constructors

- `EnchantmentProtection(Enchantment.Rarity rarityIn, EnchantmentProtection.Type protectionTypeIn, EntityEquipmentSlot ... slots)`

## Methods

- `int calcModifierDamage(int level, DamageSource source)`
- `boolean canApplyTogether(Enchantment ench)`
- `static double getBlastDamageReduction(EntityLivingBase entityLivingBaseIn, double damage)`
- `static int getFireTimeForEntity(EntityLivingBase p_92093_0_, int p_92093_1_)`
- `int getMaxEnchantability(int enchantmentLevel)`
- `int getMaxLevel()`
- `int getMinEnchantability(int enchantmentLevel)`
- `java.lang.String getName()`

## Fields

- `EnchantmentProtection.Type protectionType`