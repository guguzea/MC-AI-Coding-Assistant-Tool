# ISpecialArmor

## Class signature

```java
public interface ISpecialArmor
```

## Methods

- `void damageArmor(EntityLivingBase entity, ItemStack stack, DamageSource source, int damage, int slot)` — Applies damage to the ItemStack.
- `int getArmorDisplay(EntityPlayer player, ItemStack armor, int slot)` — Get the displayed effective armor.
- `ISpecialArmor.ArmorProperties getProperties(EntityLivingBase player, ItemStack armor, DamageSource source, double damage, int slot)` — Retrieves the modifiers to be used when calculating armor damage.
- `default boolean handleUnblockableDamage(EntityLivingBase entity, ItemStack armor, DamageSource source, double damage, int slot)` — Simple check to see if the armor should interact with "Unblockable" damage sources.