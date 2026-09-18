# ISpecialArmor

## Class signature

```java
public interface ISpecialArmor
```

## Methods

- `ISpecialArmor.ArmorProperties getProperties( EntityLivingBase player, ItemStack armor, DamageSource source, double damage, int slot)`
- `int getArmorDisplay( EntityPlayer player, ItemStack armor, int slot)`
- `void damageArmor( EntityLivingBase entity, ItemStack stack, DamageSource source, int damage, int slot)`
- `default boolean handleUnblockableDamage( EntityLivingBase entity, ItemStack armor, DamageSource source, double damage, int slot)`

## Description

This interface is to be implemented by ItemArmor classes. It will allow to modify computation of damage and health loss. Computation will be called before the actual armor computation, which can then