# EntityLiving

## Class signature

```java
public abstract class EntityLiving extends EntityLivingBase
```

## Constructors

- `public EntityLiving( World p_i1595_1_)`

## Methods

- `protected void applyEntityAttributes()`
- `public EntityLookHelper getLookHelper()`
- `public EntityMoveHelper getMoveHelper()`
- `public EntityJumpHelper getJumpHelper()`
- `public PathNavigate getNavigator()`
- `public EntitySenses getEntitySenses()`
- `public EntityLivingBase getAttackTarget()`
- `public void setAttackTarget( EntityLivingBase p_70624_1_)`
- `public boolean canAttackClass(java.lang.Class p_70686_1_)`
- `public void eatGrassBonus()`
- `protected void entityInit()`
- `public int getTalkInterval()`
- `public void playLivingSound()`
- `public void onEntityUpdate()`
- `protected int getExperiencePoints( EntityPlayer p_70693_1_)`
- `public void spawnExplosionParticle()`
- `public void onUpdate()`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `protected java.lang.String getLivingSound()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `public void setMoveForward(float p_70657_1_)`
- `public void setAIMoveSpeed(float p_70659_1_)`
- `public void onLivingUpdate()`
- `protected boolean isAIEnabled()`
- `protected boolean canDespawn()`
- `protected void despawnEntity()`
- `protected void updateAITasks()`
- `protected void updateEntityActionState()`
- `public int getVerticalFaceSpeed()`
- `public void faceEntity( Entity p_70625_1_, float p_70625_2_, float p_70625_3_)`
- `public boolean getCanSpawnHere()`
- `public float getRenderSizeModifier()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxSafePointTries()`
- `public ItemStack getHeldItem()`
- `public ItemStack getEquipmentInSlot(int p_71124_1_)`
- `public ItemStack func_130225_q(int p_130225_1_)`
- `public void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `public ItemStack [] getLastActiveItems()`
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)`
- `protected void addRandomArmor()`
- `public static int getArmorPosition( ItemStack p_82159_0_)`
- `public static Item getArmorItemForSlot(int p_82161_0_, int p_82161_1_)`
- `protected void enchantEquipment()`
- `public IEntityLivingData onSpawnWithEgg( IEntityLivingData p_110161_1_)`
- `public boolean canBeSteered()`
- `public java.lang.String getCommandSenderName()`
- `public void func_110163_bv()`
- `public void setCustomNameTag(java.lang.String p_94058_1_)`
- `public java.lang.String getCustomNameTag()`
- `public boolean hasCustomNameTag()`
- `public void setAlwaysRenderNameTag(boolean p_94061_1_)`
- `public boolean getAlwaysRenderNameTag()`
- `public boolean getAlwaysRenderNameTagForRender()`
- `public void setEquipmentDropChance(int p_96120_1_, float p_96120_2_)`
- `public boolean canPickUpLoot()`
- `public void setCanPickUpLoot(boolean p_98053_1_)`
- `public boolean isNoDespawnRequired()`
- `public final boolean interactFirst( EntityPlayer p_130002_1_)`
- `protected boolean interact( EntityPlayer p_70085_1_)`
- `protected void updateLeashedState()`
- `public void clearLeashed(boolean p_110160_1_, boolean p_110160_2_)`
- `public boolean allowLeashing()`
- `public boolean getLeashed()`
- `public Entity getLeashedToEntity()`
- `public void setLeashedToEntity( Entity p_110162_1_, boolean p_110162_2_)`