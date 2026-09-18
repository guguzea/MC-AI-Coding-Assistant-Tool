# BehaviorProjectileDispense

## Class signature

```java
public abstract class BehaviorProjectileDispense extends BehaviorDefaultDispenseItem
```

## Constructors

- `public BehaviorProjectileDispense()`

## Methods

- `public ItemStack dispenseStack( IBlockSource source, ItemStack stack)`
- `protected void playDispenseSound( IBlockSource source)`
- `protected abstract IProjectile getProjectileEntity( World worldIn, IPosition position)`
- `protected float func_82498_a()`
- `protected float func_82500_b()`

## Description

Dispense the specified stack, play the dispense sound and spawn particles.