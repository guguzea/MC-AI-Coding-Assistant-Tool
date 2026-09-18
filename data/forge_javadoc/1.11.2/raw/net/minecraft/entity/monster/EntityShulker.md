---
title: "EntityShulker"
description: "public class EntityShulker extends EntityGolem implements IMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityShulker.html"
sourceType: javadoc
---

# EntityShulker

## Class signature

```java
public class EntityShulker extends EntityGolem implements IMob
```

## Constructors

- `public EntityShulker( World worldIn)`

## Methods

- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `protected void initEntityAI()`
- `protected boolean canTriggerWalking()`
- `public SoundCategory getSoundCategory()`
- `protected SoundEvent getAmbientSound()`
- `public void playLivingSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `protected EntityBodyHelper createBodyHelper()`
- `public static void registerFixesShulker( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void onUpdate()`
- `public void move( MoverType type, double x, double y, double z)`
- `public void setPosition(double x, double y, double z)`
- `protected boolean tryTeleportToNewPosition()`
- `public void onLivingUpdate()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox()`
- `public EnumFacing getAttachmentFacing()`
- `@Nullable public BlockPos getAttachmentPos()`
- `public void setAttachmentPos(@Nullable BlockPos pos)`
- `public int getPeekTick()`
- `public void updateArmorModifier(int p_184691_1_)`
- `public float getClientPeekAmount(float p_184688_1_)`
- `public int getClientTeleportInterp()`
- `public BlockPos getOldAttachPos()`
- `public float getEyeHeight()`
- `public int getVerticalFaceSpeed()`
- `public int getHorizontalFaceSpeed()`
- `public void applyEntityCollision( Entity entityIn)`
- `public float getCollisionBorderSize()`
- `public boolean isAttachedToBlock()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public EnumDyeColor getColor()`
