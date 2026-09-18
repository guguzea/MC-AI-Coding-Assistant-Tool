# EnchantmentFrostWalker

## Class signature

```java
public class EnchantmentFrostWalker extends Enchantment
```

## Constructors

- `public EnchantmentFrostWalker( Enchantment.Rarity rarityIn, EntityEquipmentSlot ... slots)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public boolean isTreasureEnchantment()`
- `public int getMaxLevel()`
- `public static void freezeNearby( EntityLivingBase living, World worldIn, BlockPos pos, int level)`
- `public boolean canApplyTogether( Enchantment ench)`