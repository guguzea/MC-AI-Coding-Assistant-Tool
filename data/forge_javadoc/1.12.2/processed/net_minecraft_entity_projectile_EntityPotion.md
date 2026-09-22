# EntityPotion

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityThrowable → net.minecraft.entity.projectile.EntityPotion

## Class signature

```java
public class EntityPotion extends EntityThrowable
```

## Constructors

- `EntityPotion(World worldIn)`
- `EntityPotion(World worldIn, double x, double y, double z, ItemStack potionDamageIn)`
- `EntityPotion(World worldIn, EntityLivingBase throwerIn, ItemStack potionDamageIn)`

## Methods

- `protected void entityInit()`
- `protected float getGravityVelocity()`
- `ItemStack getPotion()`
- `protected void onImpact(RayTraceResult result)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesPotion(DataFixer fixer)`
- `void setItem(ItemStack stack)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `static<any> WATER_SENSITIVE`