# EntityWither

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.boss.EntityWither

## Class signature

```java
public class EntityWither extends EntityMob implements IRangedAttackMob
```

## Methods

- `void addPotionEffect(PotionEffect potioneffectIn)`
- `void addTrackingPlayer(EntityPlayerMP player)`
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `void attackEntityWithRangedAttack(EntityLivingBase target, float distanceFactor)`
- `protected boolean canBeRidden(Entity entityIn)`
- `static boolean canDestroyBlock(Block blockIn)`
- `protected void despawnEntity()`
- `protected void dropFewItems(boolean wasRecentlyHit, int lootingModifier)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `int getBrightnessForRender(float partialTicks)`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `float getHeadXRotation(int p_82210_1_)`
- `float getHeadYRotation(int p_82207_1_)`
- `protected SoundEvent getHurtSound()`
- `int getInvulTime()`
- `int getWatchedTargetId(int head)`
- `void ignite()`
- `protected void initEntityAI()`
- `boolean isArmored()`
- `boolean isNonBoss()`
- `void onLivingUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesWither(DataFixer fixer)`
- `void removeTrackingPlayer(EntityPlayerMP player)`
- `void setInvulTime(int time)`
- `void setInWeb()`
- `protected void updateAITasks()`
- `void updateWatchedTargetId(int targetOffset, int newId)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityWither`