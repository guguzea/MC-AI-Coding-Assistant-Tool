# EntityCreeper

## Class signature

```java
public class EntityCreeper extends EntityMob
```

## Constructors

- `public EntityCreeper( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public int getMaxFallHeight()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onUpdate()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void onDeath( DamageSource cause)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean getPowered()`
- `public float getCreeperFlashIntensity(float p_70831_1_)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public int getCreeperState()`
- `public void setCreeperState(int state)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public boolean hasIgnited()`
- `public void ignite()`
- `public boolean isAIEnabled()`
- `public void incrementDroppedSkulls()`