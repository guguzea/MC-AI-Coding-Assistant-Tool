# Enchantment

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Enchantment> → net.minecraft.enchantment.Enchantment

## Class signature

```java
public abstract class Enchantment extends IForgeRegistryEntry.Impl<Enchantment>
```

## Constructors

- `Enchantment(Enchantment.Rarity rarityIn, EnumEnchantmentType typeIn, EntityEquipmentSlot [] slots)`

## Methods

- `float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `int calcModifierDamage(int level, DamageSource source)`
- `boolean canApply(ItemStack stack)`
- `boolean canApplyAtEnchantingTable(ItemStack stack)` — This applies specifically to applying at the enchanting table.
- `protected boolean canApplyTogether(Enchantment ench)`
- `static Enchantment getEnchantmentByID(int id)`
- `static Enchantment getEnchantmentByLocation(java.lang.String location)`
- `static int getEnchantmentID(Enchantment enchantmentIn)`
- `java.util.List<ItemStack> getEntityEquipment(EntityLivingBase entityIn)`
- `int getMaxEnchantability(int enchantmentLevel)`
- `int getMaxLevel()`
- `int getMinEnchantability(int enchantmentLevel)`
- `int getMinLevel()`
- `java.lang.String getName()`
- `Enchantment.Rarity getRarity()`
- `java.lang.String getTranslatedName(int level)`
- `boolean isAllowedOnBooks()` — Is this enchantment allowed to be enchanted on books via Enchantment Table
- `boolean isCompatibleWith(Enchantment p_191560_1_)`
- `boolean isCurse()`
- `boolean isTreasureEnchantment()`
- `void onEntityDamaged(EntityLivingBase user, Entity target, int level)`
- `void onUserHurt(EntityLivingBase user, Entity attacker, int level)`
- `static void registerEnchantments()`
- `Enchantment setName(java.lang.String enchName)`

## Fields

- `protected java.lang.String name`
- `static RegistryNamespaced<ResourceLocation, Enchantment> REGISTRY`
- `EnumEnchantmentType type`