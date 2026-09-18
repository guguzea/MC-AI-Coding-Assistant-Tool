# EntityPotion

## Class signature

```java
public class EntityPotion extends EntityThrowable
```

## Constructors

- `public EntityPotion( World worldIn)`
- `public EntityPotion( World worldIn, EntityLivingBase throwerIn, ItemStack potionDamageIn)`
- `public EntityPotion( World worldIn, double x, double y, double z, @Nullable ItemStack potionDamageIn)`

## Methods

- `protected void entityInit()`
- `public ItemStack getPotion()`
- `public void setItem(@Nullable ItemStack stack)`
- `protected float getGravityVelocity()`
- `protected void onImpact( RayTraceResult result)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`