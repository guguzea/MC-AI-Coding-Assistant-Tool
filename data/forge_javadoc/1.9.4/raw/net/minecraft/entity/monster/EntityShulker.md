---
title: "EntityShulker"
description: "public class EntityShulker extends EntityGolem implements IMob"
package: "net/minecraft/entity/monster"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/monster/EntityShulker.html"
sourceType: javadoc
---

# EntityShulker

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityGolem → net.minecraft.entity.monster.EntityShulker

## Class signature

```java
public class EntityShulker extends EntityGolem implements IMob
```

## Constructors

- `EntityShulker(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `void applyEntityCollision(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canTriggerWalking()`
- `protected EntityBodyHelper createBodyHelper()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `EnumFacing getAttachmentFacing()`
- `BlockPos getAttachmentPos()`
- `float getClientPeekAmount(float p_184688_1_)`
- `int getClientTeleportInterp()`
- `float getCollisionBorderSize()`
- `AxisAlignedBB getCollisionBoundingBox()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `int getHorizontalFaceSpeed()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `BlockPos getOldAttachPos()`
- `int getPeekTick()`
- `SoundCategory getSoundCategory()`
- `int getVerticalFaceSpeed()`
- `protected void initEntityAI()`
- `boolean isAttachedToBlock()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void playLivingSound()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setAttachmentPos(BlockPos pos)`
- `void setPosition(double x, double y, double z)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `protected boolean tryTeleportToNewPosition()`
- `void updateArmorModifier(int p_184691_1_)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected static DataParameter<com.google.common.base.Optional<BlockPos>> ATTACHED_BLOCK_POS`
- `protected static DataParameter<EnumFacing> ATTACHED_FACE`
- `protected static DataParameter<java.lang.Byte> PEEK_TICK`
