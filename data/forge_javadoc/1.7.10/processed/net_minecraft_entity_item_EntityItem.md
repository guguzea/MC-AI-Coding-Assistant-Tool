# EntityItem

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityItem

## Class signature

```java
public class EntityItem extends Entity
```

## Constructors

- `EntityItem(World p_i1711_1_)`
- `EntityItem(World p_i1709_1_, double p_i1709_2_, double p_i1709_4_, double p_i1709_6_)`
- `EntityItem(World p_i1710_1_, double p_i1710_2_, double p_i1710_4_, double p_i1710_6_, ItemStack p_i1710_8_)`

## Methods

- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canAttackWithItem()`
- `protected boolean canTriggerWalking()`
- `boolean combineItems(EntityItem p_70289_1_)`
- `protected void dealFireDamage(int p_70081_1_)`
- `protected void entityInit()`
- `void func_145797_a(java.lang.String p_145797_1_)`
- `java.lang.String func_145798_i()`
- `void func_145799_b(java.lang.String p_145799_1_)`
- `java.lang.String func_145800_j()`
- `java.lang.String getCommandSenderName()`
- `ItemStack getEntityItem()`
- `boolean handleWaterMovement()`
- `void onCollideWithPlayer(EntityPlayer p_70100_1_)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setAgeToCreativeDespawnTime()`
- `void setEntityItemStack(ItemStack p_92058_1_)`
- `void travelToDimension(int p_71027_1_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int age`
- `int delayBeforeCanPickup`
- `float hoverStart`