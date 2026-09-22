# EntityMoveHelper

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityMoveHelper

## Class signature

```java
public class EntityMoveHelper extends java.lang.Object
```

## Constructors

- `EntityMoveHelper(EntityLiving entitylivingIn)`

## Methods

- `double getSpeed()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `boolean isUpdating()`
- `protected float limitAngle(float sourceAngle, float targetAngle, float maximumChange)`
- `void onUpdateMoveHelper()`
- `void read(EntityMoveHelper that)`
- `void setMoveTo(double x, double y, double z, double speedIn)`
- `void strafe(float forward, float strafe)`

## Fields

- `EntityMoveHelper.Action action`
- `protected EntityLiving entity`
- `protected float moveForward`
- `protected float moveStrafe`
- `protected double posX`
- `protected double posY`
- `protected double posZ`
- `protected double speed`