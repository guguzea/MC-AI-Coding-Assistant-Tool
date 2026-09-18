# EntityAgeable

## Class signature

```java
public abstract class EntityAgeable extends EntityCreature
```

## Constructors

- `public EntityAgeable( World worldIn)`

## Methods

- `public abstract EntityAgeable createChild( EntityAgeable ageable)`
- `public boolean interact( EntityPlayer player)`
- `protected void entityInit()`
- `public int getGrowingAge()`
- `public void func_175501_a(int p_175501_1_, boolean p_175501_2_)`
- `public void addGrowth(int growth)`
- `public void setGrowingAge(int age)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void onLivingUpdate()`
- `protected void onGrowingAdult()`
- `public boolean isChild()`
- `public void setScaleForAge(boolean p_98054_1_)`
- `protected final void setSize(float width, float height)`
- `protected final void setScale(float scale)`

## Description

"Adds the value of the parameter times 20 to the age of this entity.