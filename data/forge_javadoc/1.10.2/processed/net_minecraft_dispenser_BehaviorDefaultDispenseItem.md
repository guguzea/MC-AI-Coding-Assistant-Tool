# BehaviorDefaultDispenseItem

## Class signature

```java
public class BehaviorDefaultDispenseItem extends java.lang.Object implements IBehaviorDispenseItem
```

## Constructors

- `public BehaviorDefaultDispenseItem()`

## Methods

- `public final ItemStack dispense( IBlockSource source, ItemStack stack)`
- `protected ItemStack dispenseStack( IBlockSource source, ItemStack stack)`
- `public static void doDispense( World worldIn, ItemStack stack, int speed, EnumFacing facing, IPosition position)`
- `protected void playDispenseSound( IBlockSource source)`
- `protected void spawnDispenseParticles( IBlockSource source, EnumFacing facingIn)`