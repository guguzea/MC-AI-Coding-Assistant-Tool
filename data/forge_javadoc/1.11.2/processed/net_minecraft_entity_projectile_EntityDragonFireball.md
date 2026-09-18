# EntityDragonFireball

## Class signature

```java
public class EntityDragonFireball extends EntityFireball
```

## Constructors

- `public EntityDragonFireball( World worldIn)`
- `public EntityDragonFireball( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `public EntityDragonFireball( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `public static void registerFixesDragonFireball( DataFixer fixer)`
- `protected void onImpact( RayTraceResult result)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected EnumParticleTypes getParticleType()`
- `protected boolean isFireballFiery()`