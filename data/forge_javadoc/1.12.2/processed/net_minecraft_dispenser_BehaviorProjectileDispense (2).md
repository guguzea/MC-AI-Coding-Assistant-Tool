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
- `protected abstract IProjectile getProjectileEntity( World worldIn, IPosition position, ItemStack stackIn)`
- `protected float getProjectileInaccuracy()`
- `protected float getProjectileVelocity()`