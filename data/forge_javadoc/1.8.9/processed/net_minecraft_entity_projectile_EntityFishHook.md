# EntityFishHook

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFishHook

## Class signature

```java
public class EntityFishHook extends Entity
```

## Constructors

- `EntityFishHook(World worldIn)`
- `EntityFishHook(World worldIn, double x, double y, double z, EntityPlayer anglerIn)`
- `EntityFishHook(World worldIn, EntityPlayer fishingPlayer)`

## Methods

- `protected void entityInit()`
- `static java.util.List<WeightedRandomFishable> func_174855_j()`
- `void handleHookCasting(double p_146035_1_, double p_146035_3_, double p_146035_5_, float p_146035_7_, float p_146035_8_)`
- `int handleHookRetraction()`
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setDead()` — Will get destroyed next tick.
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `void setVelocity(double x, double y, double z)` — Sets the velocity to the args.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityPlayer angler`
- `Entity caughtEntity`
- `static java.util.List<WeightedRandomFishable> FISH`
- `static java.util.List<WeightedRandomFishable> JUNK`
- `int shake`
- `static java.util.List<WeightedRandomFishable> TREASURE`