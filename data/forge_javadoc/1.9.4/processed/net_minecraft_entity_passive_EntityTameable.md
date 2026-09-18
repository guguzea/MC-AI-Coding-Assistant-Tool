# EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `public EntityTameable( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canBeLeashedTo( EntityPlayer player)`
- `protected void playTameEffect(boolean play)`
- `public void handleStatusUpdate(byte id)`
- `public boolean isTamed()`
- `public void setTamed(boolean tamed)`
- `protected void setupTamedAI()`
- `public boolean isSitting()`
- `public void setSitting(boolean sitting)`
- `@Nullable public java.util.UUID getOwnerId()`
- `public void setOwnerId(@Nullable java.util.UUID p_184754_1_)`
- `@Nullable public EntityLivingBase getOwner()`
- `public boolean isOwner( EntityLivingBase entityIn)`
- `public EntityAISit getAISit()`
- `public boolean shouldAttackEntity( EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `public Team getTeam()`
- `public boolean isOnSameTeam( Entity entityIn)`
- `public void onDeath( DamageSource cause)`