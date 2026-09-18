# Explosion

## Class signature

```java
public class Explosion extends java.lang.Object
```

## Constructors

- `public Explosion( World worldIn, Entity entityIn, double x, double y, double z, float size, java.util.List< BlockPos > affectedPositions)`
- `public Explosion( World worldIn, Entity entityIn, double x, double y, double z, float size, boolean flaming, boolean smoking, java.util.List< BlockPos > affectedPositions)`
- `public Explosion( World worldIn, Entity entityIn, double x, double y, double z, float size, boolean flaming, boolean smoking)`

## Methods

- `public void doExplosionA()`
- `public void doExplosionB(boolean spawnParticles)`
- `public java.util.Map< EntityPlayer , Vec3d > getPlayerKnockbackMap()`
- `@Nullable public EntityLivingBase getExplosivePlacedBy()`
- `public void clearAffectedBlockPositions()`
- `public java.util.List< BlockPos > getAffectedBlockPositions()`
- `public Vec3d getPosition()`