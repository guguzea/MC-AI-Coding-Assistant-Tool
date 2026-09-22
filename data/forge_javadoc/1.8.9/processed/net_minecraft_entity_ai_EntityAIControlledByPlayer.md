# EntityAIControlledByPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIControlledByPlayer

## Class signature

```java
public class EntityAIControlledByPlayer extends EntityAIBase
```

## Constructors

- `EntityAIControlledByPlayer(EntityLiving entitylivingIn, float maxspeed)`

## Methods

- `void boostSpeed()` — Boost the entity's movement speed.
- `boolean isControlledByPlayer()` — Return whether the entity is being controlled by a player.
- `boolean isSpeedBoosted()` — Return whether the entity's speed is boosted.
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task