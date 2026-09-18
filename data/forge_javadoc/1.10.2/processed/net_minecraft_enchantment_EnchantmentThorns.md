# EnchantmentThorns

## Class signature

```java
public class EnchantmentThorns extends Enchantment
```

## Constructors

- `public EnchantmentThorns( Enchantment.Rarity rarityIn, EntityEquipmentSlot ... slots)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public boolean canApply( ItemStack stack)`
- `public void onUserHurt( EntityLivingBase user, Entity attacker, int level)`
- `public static boolean shouldHit(int level, java.util.Random rnd)`
- `public static int getDamage(int level, java.util.Random rnd)`