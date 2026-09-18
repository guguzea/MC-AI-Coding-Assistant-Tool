# EntityShulkerBullet

## Class signature

```java
public class EntityShulkerBullet extends Entity
```

## Constructors

- `public EntityShulkerBullet( World worldIn)`
- `public EntityShulkerBullet( World worldIn, double x, double y, double z, double motionXIn, double motionYIn, double motionZIn)`
- `public EntityShulkerBullet( World worldIn, EntityLivingBase ownerIn, Entity targetIn, EnumFacing.Axis p_i46772_4_)`

## Methods

- `public SoundCategory getSoundCategory()`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void entityInit()`
- `public void onUpdate()`
- `public boolean isBurning()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public float getBrightness()`
- `public int getBrightnessForRender()`
- `protected void bulletHit( RayTraceResult result)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`