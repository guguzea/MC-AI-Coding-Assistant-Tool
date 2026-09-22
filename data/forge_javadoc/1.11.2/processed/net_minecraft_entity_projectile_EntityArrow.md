# EntityArrow

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityArrow

## Class signature

```java
public abstract class EntityArrow extends Entity implements IProjectile
```

## Constructors

- `EntityArrow(World worldIn)`
- `EntityArrow(World worldIn, double x, double y, double z)`
- `EntityArrow(World worldIn, EntityLivingBase shooter)`

## Methods

- `protected void arrowHit(EntityLivingBase living)`
- `boolean canBeAttackedWithItem()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `protected Entity findEntityOnPath(Vec3d start, Vec3d end)`
- `protected abstract ItemStack getArrowStack()`
- `double getDamage()`
- `float getEyeHeight()`
- `boolean getIsCritical()`
- `boolean isInRangeToRenderDist(double distance)`
- `void move(MoverType type, double x, double y, double z)`
- `void onCollideWithPlayer(EntityPlayer entityIn)`
- `protected void onHit(RayTraceResult raytraceResultIn)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesArrow(DataFixer fixer)`
- `static void registerFixesArrow(DataFixer fixer, java.lang.String name)`
- `void setAim(Entity shooter, float pitch, float yaw, float p_184547_4_, float velocity, float inaccuracy)`
- `void setDamage(double damageIn)`
- `void setEnchantmentEffectsFromEntity(EntityLivingBase p_190547_1_, float p_190547_2_)`
- `void setIsCritical(boolean critical)`
- `void setKnockbackStrength(int knockbackStrengthIn)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `void setVelocity(double x, double y, double z)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `int arrowShake`
- `protected boolean inGround`
- `EntityArrow.PickupStatus pickupStatus`
- `Entity shootingEntity`
- `protected int timeInGround`