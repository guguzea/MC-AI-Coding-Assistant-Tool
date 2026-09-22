# EntityItem

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityItem

## Class signature

```java
public class EntityItem extends Entity
```

## Constructors

- `EntityItem(World worldIn)`
- `EntityItem(World worldIn, double x, double y, double z)`
- `EntityItem(World worldIn, double x, double y, double z, ItemStack stack)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeAttackedWithItem()`
- `boolean cannotPickup()`
- `protected boolean canTriggerWalking()`
- `Entity changeDimension(int dimensionIn, ITeleporter teleporter)`
- `protected void dealFireDamage(int amount)`
- `protected void entityInit()`
- `int getAge()`
- `ItemStack getItem()`
- `java.lang.String getName()`
- `java.lang.String getOwner()`
- `java.lang.String getThrower()`
- `boolean handleWaterMovement()`
- `void makeFakeItem()`
- `void onCollideWithPlayer(EntityPlayer entityIn)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesItem(DataFixer fixer)`
- `void setAgeToCreativeDespawnTime()`
- `void setDefaultPickupDelay()`
- `void setInfinitePickupDelay()`
- `void setItem(ItemStack stack)`
- `void setNoDespawn()`
- `void setNoPickupDelay()`
- `void setOwner(java.lang.String owner)`
- `void setPickupDelay(int ticks)`
- `void setThrower(java.lang.String thrower)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `float hoverStart`
- `int lifespan` — The maximum age of this EntityItem.