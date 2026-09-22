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

- `protected void onImpact(RayTraceResult result)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesLargeFireball(DataFixer fixer)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `int explosionPower`