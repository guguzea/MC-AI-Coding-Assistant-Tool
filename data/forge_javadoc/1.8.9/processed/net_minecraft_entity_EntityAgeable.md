# EntityAgeable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable

## Class signature

```java
public abstract class EntityAgeable extends EntityCreature
```

## Constructors

- `EntityAgeable(World worldIn)`

## Methods

- `void addGrowth(int growth)` — "Adds the value of the parameter times 20 to the age of this entity.
- `abstract EntityAgeable createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `void func_175501_a(int p_175501_1_, boolean p_175501_2_)`
- `int getGrowingAge()` — The age value may be negative or positive or zero.
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isChild()` — If Animal, checks if the age timer is negative
- `protected void onGrowingAdult()` — This is called when Entity's growing age timer reaches 0 (negative values are considered as a child, positive as an adult)
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setGrowingAge(int age)` — The age value may be negative or positive or zero.
- `protected void setScale(float scale)`
- `void setScaleForAge(boolean p_98054_1_)` — "Sets the scale for an ageable entity according to the boolean parameter, which says if it's a child."
- `protected void setSize(float width, float height)` — Sets the width and height of the entity.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected int field_175502_b`
- `protected int field_175503_c`
- `protected int growingAge`