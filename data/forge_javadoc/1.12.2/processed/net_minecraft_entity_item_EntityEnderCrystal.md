# EntityEnderCrystal

## Class signature

```java
public class EntityEnderCrystal extends Entity
```

## Constructors

- `public EntityEnderCrystal( World worldIn)`
- `public EntityEnderCrystal( World worldIn, double x, double y, double z)`

## Methods

- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void onKillCommand()`
- `public void setBeamTarget( BlockPos beamTarget)`
- `public BlockPos getBeamTarget()`
- `public void setShowBottom(boolean showBottom)`
- `public boolean shouldShowBottom()`
- `public boolean isInRangeToRenderDist(double distance)`