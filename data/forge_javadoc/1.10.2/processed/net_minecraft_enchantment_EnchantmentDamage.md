# EnchantmentDamage

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Enchantment> → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentDamage

## Class signature

```java
public class EnchantmentDamage extends Enchantment
```

## Constructors

- `EnchantmentDamage(Enchantment.Rarity rarityIn, int damageTypeIn, EntityEquipmentSlot ... slots)`

## Methods

- `float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `boolean canApply(ItemStack stack)`
- `boolean canApplyTogether(Enchantment ench)`
- `int getMaxEnchantability(int enchantmentLevel)`
- `int getMaxLevel()`
- `int getMinEnchantability(int enchantmentLevel)`
- `java.lang.String getName()`
- `void onEntityDamaged(EntityLivingBase user, Entity target, int level)`

## Fields

- `int damageType`