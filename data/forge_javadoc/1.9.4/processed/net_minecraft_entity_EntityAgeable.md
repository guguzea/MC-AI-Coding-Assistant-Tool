# EntityAgeable

## Class signature

```java
public abstract class EntityAgeable extends EntityCreature
```

## Constructors

- `public EntityAgeable( World worldIn)`

## Methods

- `public abstract EntityAgeable createChild( EntityAgeable ageable)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected void entityInit()`
- `public int getGrowingAge()`
- `public void ageUp(int p_175501_1_, boolean p_175501_2_)`
- `public void addGrowth(int growth)`
- `public void setGrowingAge(int age)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public void onLivingUpdate()`
- `protected void onGrowingAdult()`
- `public boolean isChild()`
- `public void setScaleForAge(boolean child)`
- `protected final void setSize(float width, float height)`
- `protected final void setScale(float scale)`