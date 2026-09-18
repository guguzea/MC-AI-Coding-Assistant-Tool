# EntityWither

## Class signature

```java
public class EntityWither extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public EntityWither( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `public static void registerFixesWither( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void setCustomNameTag(java.lang.String name)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `public static boolean canDestroyBlock( Block blockIn)`
- `public void ignite()`
- `public void setInWeb()`
- `public void addTrackingPlayer( EntityPlayerMP player)`
- `public void removeTrackingPlayer( EntityPlayerMP player)`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void dropFewItems(boolean wasRecentlyHit, int lootingModifier)`
- `protected void despawnEntity()`
- `public int getBrightnessForRender(float partialTicks)`
- `public void fall(float distance, float damageMultiplier)`
- `public void addPotionEffect( PotionEffect potioneffectIn)`
- `protected void applyEntityAttributes()`
- `public float getHeadYRotation(int p_82207_1_)`
- `public float getHeadXRotation(int p_82210_1_)`
- `public int getInvulTime()`
- `public void setInvulTime(int time)`
- `public int getWatchedTargetId(int head)`
- `public void updateWatchedTargetId(int targetOffset, int newId)`
- `public boolean isArmored()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `protected boolean canBeRidden( Entity entityIn)`
- `public boolean isNonBoss()`