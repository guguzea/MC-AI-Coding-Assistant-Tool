# BehaviorDefaultDispenseItem

**Inheritance:** java.lang.Object → net.minecraft.dispenser.BehaviorDefaultDispenseItem

## Class signature

```java
public class BehaviorDefaultDispenseItem extends java.lang.Object implements IBehaviorDispenseItem
```

## Methods

- `ItemStack dispense(IBlockSource source, ItemStack stack)` — Dispenses the specified ItemStack from a dispenser.
- `protected ItemStack dispenseStack(IBlockSource source, ItemStack stack)` — Dispense the specified stack, play the dispense sound and spawn particles.
- `static void doDispense(World worldIn, ItemStack stack, int speed, EnumFacing facing, IPosition position)`
- `protected void playDispenseSound(IBlockSource source)` — Play the dispense sound from the specified block.
- `protected void spawnDispenseParticles(IBlockSource source, EnumFacing facingIn)` — Order clients to display dispense particles from the specified block and facing.

## Fields

- `BehaviorDefaultDispenseItem`