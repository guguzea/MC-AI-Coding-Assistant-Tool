# 实体代码模式（Forge 1.18.2）

```yaml
模式: 实体注册
分类: entity
```

## 基础生物实体

```java
// 注册（Forge 1.18.2 使用 ENTITYTYPES）
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITYTYPES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
        .sized(0.6f, 1.8f)
        .clientTrackingRange(8)
        .updateInterval(3)
        .build("my_entity")
);

// 实体类
public class MyEntity extends LivingEntity {
    private static final EntityDataAccessor<Integer> DATA_HEALTH =
        SynchedEntityData.defineId(MyEntity.class, EntityDataSerializers.INT);

    protected MyEntity(EntityType<? extends MyEntity> type, Level level) {
        super(type, level);
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        this.goalSelector.addGoal(0, new FloatGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomStrollGoal(this, 1.0));
        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, Player.class, true));
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(Attributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(Attributes.MOVEMENT_SPEED).setBaseValue(0.3);
        this.getAttribute(Attributes.ATTACK_DAMAGE).setBaseValue(3.0);
        this.getAttribute(Attributes.FOLLOW_RANGE).setBaseValue(32.0);
    }

    @Override
    protected void defineSynchedData() {
        super.defineSynchedData();
        this.entityData.define(DATA_HEALTH, this.getMaxHealth());
    }
}
```

## 投掷物实体（Projectile）

```java
public class MyProjectile extends Projectile {
    public static final EntityType<MyProjectile> TYPE = /* 注册 */;

    public MyProjectile(EntityType<? extends MyProjectile> type, Level level) {
        super(type, level);
    }

    @Override
    protected void onHit(HitResult result) {
        super.onHit(result);
        if (!this.level.isClientSide) {
            this.level.explode(null, this.getX(), this.getY(), this.getZ(),
                2.0f, Level.ExplosionInteraction.BLOW);
            this.discard();
        }
    }
}
```

## 实体属性注册

```java
// Forge 1.18.2 使用 ATTRIBUTES
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID);

public static final RegistryObject<Attribute> EXTRA_HEALTH = ATTRIBUTES.register("extra_health",
    () -> new RangedAttribute("attribute.modid.extra_health", 0.0, 0.0, 1000.0).setSyncable(true)
);

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);
```
