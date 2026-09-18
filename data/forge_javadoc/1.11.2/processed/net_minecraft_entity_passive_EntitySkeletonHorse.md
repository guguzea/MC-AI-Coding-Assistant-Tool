# EntitySkeletonHorse

## Class signature

```java
public class EntitySkeletonHorse extends AbstractHorse
```

## Constructors

- `public EntitySkeletonHorse( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public double getMountedYOffset()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void onLivingUpdate()`
- `public static void registerFixesSkeletonHorse( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean isTrap()`
- `public void setTrap(boolean trap)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`