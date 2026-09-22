# EntityCreeper

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityCreeper

## Class signature

```java
public class EntityCreeper extends EntityMob
```

## Methods

- `boolean ableToCauseSkullDrop()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `float getCreeperFlashIntensity(float p_70831_1_)`
- `int getCreeperState()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `int getMaxFallHeight()`
- `boolean getPowered()`
- `boolean hasIgnited()`
- `void ignite()`
- `void incrementDroppedSkulls()`
- `protected void initEntityAI()`
- `void onDeath(DamageSource cause)`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `void onUpdate()`
- `protected boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesCreeper(DataFixer fixer)`
- `void setCreeperState(int state)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityCreeper`