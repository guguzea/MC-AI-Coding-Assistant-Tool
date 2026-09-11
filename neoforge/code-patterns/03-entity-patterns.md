# 实体代码模式（NeoForge 1.20.4）

## 基础生物实体

```java
// 注册
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(NeoForgeRegistries.ENTITY_TYPES, MOD_ID);

public static final DeferredHolder<EntityType<?>, EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
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

    public static AttributeSupplier.Builder createAttributes() {
        return Mob.createMobAttributes()
            .add(Attributes.MAX_HEALTH, 20.0D)
            .add(Attributes.MOVEMENT_SPEED, 0.3D)
            .add(Attributes.ATTACK_DAMAGE, 3.0D);
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
// 注意：NeoForge 1.20.4 使用 net.neoforged.neoforge.client 包
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onRegisterLayerDefs(EntityRenderersEvent.RegisterLayerDefinitions event) {
        event.registerLayerDefinition(MY_MODEL_LAYER, () ->
            // 1.20.4 实测：LayerDefinition.create(MeshDefinition, int, int)，mesh 由 HumanoidModel.createMesh(CubeDeformation, float) 产出
            // ⚠️ ModelLayers 在 1.20.4 没有 createHumanoidBody()（该类只有 createLocation / register / registerInnerArmor / registerOuterArmor / create*ModelName 等）
            LayerDefinition.create(HumanoidModel.createMesh(CubeDeformation.NONE, 0.0f), 64, 32)
        );
    }

    @SubscribeEvent
    public static void onRegisterRenderers(EntityRenderersEvent.RegisterRenderers event) {
        // 本文件顶部声明的是 DeferredHolder MY_ENTITY（没有 MyEntity.TYPE 这个字段）
        event.registerEntityRenderer(MY_ENTITY.get(), MyEntityRenderer::new);
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
    DeferredRegister.create(NeoForgeRegistries.ATTRIBUTES, MOD_ID);

public static final DeferredHolder<Attribute, Attribute> EXTRA_HEALTH = ATTRIBUTES.register("extra_health",
    () -> new RangedAttribute("attribute.modid.extra_health", 0.0, 0.0, 1000.0).setSyncable(true)
);

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);

// 实体中应用（1.20.4 实测形状）：Entity#getAttribute(Attribute) 返回 AttributeInstance（不是 Optional）
AttributeInstance extra = this.getAttribute(EXTRA_HEALTH.get());
if (extra != null) {
    // 1.20.4 实测：AttributeModifier(String name, double amount, AttributeModifier.Operation)
    // 本档语料原文用的是 Operation.ADD；1.21.11 反编译源码里已改名 ADD_VALUE（另有 ADD_MULTIPLIED_BASE / _TOTAL）
    extra.addPermanentModifier(new AttributeModifier("modid.extra_health", 4.0, AttributeModifier.Operation.ADD));
}

// TODO(未核实)：① NeoForgeRegistries.ATTRIBUTES 这个常量名在本档 1.20.4 语料（61 页）里查无出处
//              （语料只出现过 NeoForgeRegistries.ATTACHMENT_TYPES）；
//              ② 自定义属性要先进该实体类型的 AttributeSupplier，NeoForge 侧的注册事件名同样无语料出处
//                 （1.20.4 语料没有任何 entities / attributes 专页）。
//              两者都须用户自备 NeoForge jar 走 ingest_loader_api + query_loader_api 逐签名核实后再写，禁止凭记忆补。
```
