# EntityTippedArrow

## Class signature

```java
public class EntityTippedArrow extends EntityArrow
```

## Constructors

- `public EntityTippedArrow( World worldIn)`
- `public EntityTippedArrow( World worldIn, double x, double y, double z)`
- `public EntityTippedArrow( World worldIn, EntityLivingBase shooter)`

## Methods

- `public void setPotionEffect( ItemStack stack)`
- `public void addEffect( PotionEffect effect)`
- `protected void entityInit()`
- `public void onUpdate()`
- `public int getColor()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected void arrowHit( EntityLivingBase living)`
- `protected ItemStack getArrowStack()`
- `public void handleStatusUpdate(byte id)`