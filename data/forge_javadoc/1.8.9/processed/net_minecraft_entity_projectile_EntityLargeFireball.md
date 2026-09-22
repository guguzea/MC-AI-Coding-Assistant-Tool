# EntityLargeFireball

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFireball → net.minecraft.entity.projectile.EntityLargeFireball

## Class signature

```java
public class EntityLargeFireball extends EntityFireball
```

## Constructors

- `EntityLargeFireball(World worldIn)`
- `EntityLargeFireball(World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `EntityLargeFireball(World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `protected void onImpact(MovingObjectPosition movingObject)` — Called when this EntityFireball hits a block or entity.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int explosionPower`