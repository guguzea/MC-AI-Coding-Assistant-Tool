# BehaviorProjectileDispense

**Inheritance:** java.lang.Object → net.minecraft.dispenser.BehaviorDefaultDispenseItem → net.minecraft.dispenser.BehaviorProjectileDispense

## Class signature

```java
public abstract class BehaviorProjectileDispense extends BehaviorDefaultDispenseItem
```

## Methods

- `ItemStack dispenseStack(IBlockSource source, ItemStack stack)` — Dispense the specified stack, play the dispense sound and spawn particles.
- `protected float func_82498_a()`
- `protected float func_82500_b()`
- `protected abstract IProjectile getProjectileEntity(World worldIn, IPosition position)` — Return the projectile entity spawned by this dispense behavior.
- `protected void playDispenseSound(IBlockSource source)` — Play the dispense sound from the specified block.

## Fields

- `BehaviorProjectileDispense`