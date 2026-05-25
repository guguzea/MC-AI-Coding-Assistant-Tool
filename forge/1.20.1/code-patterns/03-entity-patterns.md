# 实体代码模式（Forge 1.20.1）

## 基础生物实体

```java
// 注册
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, MOD_ID);

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
            // 爆炸效果
            this.level.explode(null, this.getX(), this.getY(), this.getZ(),
                2.0f, Level.ExplosionInteraction.BLOW);
            this.discard();
        }
    }

    @Override
    protected void defineSynchedData() {
        super.defineSynchedData();
    }
}
```

## 实体渲染器（Biped）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onRegisterLayerDefs(EntityRenderersEvent.RegisterLayerDefinitions event) {
        event.registerLayerDefinition(MY_MODEL_LAYER, () ->
            LayerDefinition.create(ModelLayers.createHumanoidBody(), 64, 32)
        );
    }

    @SubscribeEvent
    public static void onRegisterRenderers(EntityRenderersEvent.RegisterRenderers event) {
        event.registerEntityRenderer(MyEntity.TYPE.get(), MyEntityRenderer::new);
    }
}

public class MyEntityRenderer extends HumanoidMobRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererProvider.Context context) {
        super(context, new MyEntityModel<>(context.bakeLayer(MY_MODEL_LAYER)), 0.5f);
        this.addLayer(new HumanoidArmorLayer<>(this,
            new MyEntityModel<>(context.bakeLayer(INNER_ARMOR)),
            new MyEntityModel<>(context.bakeLayer(OUTER_ARMOR))));
    }

    @Override
    public ResourceLocation getTextureLocation(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

## 实体属性注册

```java
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID);

public static final RegistryObject<Attribute> EXTRA_HEALTH = ATTRIBUTES.register("extra_health",
    () -> new RangedAttribute("attribute.modid.extra_health", 0.0, 0.0, 1000.0).setSyncable(true)
);

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);

// 实体中应用
this.getAttribute(ATTRIBUTES.get("extra_health")).ifPresent(attr ->
    this.getAttributeMap().registerAttribute(attr)
);
```
