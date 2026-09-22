# EntityFlying

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityFlying

## Class signature

```java
public abstract class EntityFlying extends EntityLiving
```

## Methods

- `void fall(float distance, float damageMultiplier)`
- `boolean isOnLadder()` — returns true if this entity is by a ladder, false otherwise
- `void moveEntityWithHeading(float strafe, float forward)` — Moves the entity based on the specified heading.
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`

## Fields

- `EntityFlying`