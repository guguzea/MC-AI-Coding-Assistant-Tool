# EntityBlaze

## Class signature

```java
public class EntityBlaze extends EntityMob
```

## Constructors

- `public EntityBlaze( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public int getBrightnessForRender(float partialTicks)`
- `public float getBrightness(float partialTicks)`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `public void fall(float distance, float damageMultiplier)`
- `public boolean isBurning()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean isCharged()`
- `public void setOnFire(boolean onFire)`
- `protected boolean isValidLightLevel()`