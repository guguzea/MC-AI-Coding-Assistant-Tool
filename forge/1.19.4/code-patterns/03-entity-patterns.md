# 实体代码模式（Forge 1.19.4）

```yaml
模式: 实体注册
分类: entity
```

> **1.19.4 关键差异**：
> 1. 注册表常量是 `ForgeRegistries.ENTITY_TYPES`（1.18.2 档写作 `ENTITYTYPES`，本档不可照抄）。
> 2. 有 AI Goal 的生物必须 `extends Mob`——`registerGoals()` / `goalSelector` / `createMobAttributes()` 都在 `Mob` 上；
>    邻档 1.18.2:24 与 1.20.1:19 写成 `extends LivingEntity` 却又重写 `registerGoals()`，在 1.19.4 索引里 `LivingEntity` 无 `registerGoals()`（`Mob#registerGoals` FOUND）。

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
        .fireImmune()
        .build(MOD_ID + ":my_entity")     // 1.19.4 索引：build(java.lang.String)
);

// 实体类
public class MyEntity extends Mob {
    private static final EntityDataAccessor<Integer> DATA_HEALTH =
        SynchedEntityData.defineId(MyEntity.class, EntityDataSerializers.INT);

    protected MyEntity(EntityType<? extends MyEntity> type, Level level) {
        super(type, level);   // Mob(EntityType, Level) 已核实
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

已核实签名：`SynchedEntityData.defineId(Class, EntityDataSerializer)`、`GoalSelector.addGoal(int, Goal)`、
`Mob.createMobAttributes()`、`Entity#defineSynchedData()`、`Entity#discard()`、`EntityType$Builder.of(EntityFactory, MobCategory)`。

## 投掷物实体（Projectile）

```java
public class MyProjectile extends Projectile {
    public static final EntityType<MyProjectile> TYPE = /* 由 ENTITY_TYPES.register(...) 得到 */;

    public MyProjectile(EntityType<? extends MyProjectile> type, Level level) {
        super(type, level);   // Projectile(EntityType, Level) 已核实
    }

    @Override
    protected void defineSynchedData() {
        super.defineSynchedData();
    }

    @Override
    protected void onHit(HitResult result) {   // 1.19.4：onHit(HitResult)；另有 onHitBlock/onHitEntity
        super.onHit(result);
        Level level = this.getLevel();
        if (!level.isClientSide) {
            // 1.19.4 索引形：explode(Entity, double x, double y, double z, float power, ExplosionInteraction)
            level.explode(null, this.getX(), this.getY(), this.getZ(),
                2.0f, Level.ExplosionInteraction.BLOW);
            this.discard();
        }
    }
}
```

## 实体渲染器

```java
// client/ClientSetup.java —— 必须走 mod bus 上的 EntityRenderersEvent（不是 FMLCommonSetupEvent）
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onRegisterLayerDefs(EntityRenderersEvent.RegisterLayerDefinitions event) {
        // 第二参是模型类里自己写的 MeshDefinition 工厂，不是原版 API
        event.registerLayerDefinition(MyEntityModel.LAYER_LOCATION, MyEntityModel::createBodyLayer);
    }

    @SubscribeEvent
    public static void onRegisterRenderers(EntityRenderersEvent.RegisterRenderers event) {
        event.registerEntityRenderer(ModEntities.MY_ENTITY.get(), MyEntityRenderer::new);
    }
}

// 普通四足/人形生物渲染器
public class MyEntityRenderer extends LivingEntityRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererProvider.Context context) {
        super(context, new MyEntityModel<>(context.bakeLayer(MyEntityModel.LAYER_LOCATION)), 0.5f);
        // ⚠️ 1.19.4 索引：ItemInHandLayer.<init>(RenderLayerParent, ItemInHandRenderer) —— 两个参数
        //    本档规则 ../.cursor/rules/04-entity.mdc:249 写的是 3 参数（getItemRenderer()+getBlockRenderDispatcher()），
        //    与该索引签名不一致 → 以 2 参数为准，若你的 Forge 构建确实需要 3 参数请以 IDE 补全核实。
        this.addLayer(new ItemInHandLayer<>(this, context.getItemInHandRenderer()));
    }

    @Override
    public ResourceLocation getTextureLocation(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

```java
// 人形（Biped）渲染器：1.19.4 索引 HumanoidMobRenderer.<init>(Context, HumanoidModel, float)
public class MyHumanoidRenderer extends HumanoidMobRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyHumanoidRenderer(EntityRendererProvider.Context context) {
        super(context, new MyEntityModel<>(context.bakeLayer(MY_MODEL_LAYER)), 0.5f);
        // ⚠️ 1.19.4 与 1.20.1 索引都是 4 参数：(RenderLayerParent, HumanoidModel, HumanoidModel, ModelManager)
        //    forge/1.20.1/code-patterns/03-entity-patterns.md:100 的 3 参数写法未被索引证实，勿照抄。
        this.addLayer(new HumanoidArmorLayer<>(this,
            new MyEntityModel<>(context.bakeLayer(INNER_ARMOR)),
            new MyEntityModel<>(context.bakeLayer(OUTER_ARMOR)),
            context.getModelManager()));
    }
}
// TODO(未核实)：ModelLayers.createHumanoidBody() —— 1.20.1 档用它拼 LayerDefinition.create(...)，
//   但 get_method_params net.minecraft.client.model.geom.ModelLayers#createHumanoidBody --version=1.19.4 返回 MISS。
//   本文件因此只用实体模型类自带的 createBodyLayer 工厂，不引用原版 ModelLayers 工厂方法。
// 已核实：LayerDefinition.create(MeshDefinition, int, int)、EntityRendererProvider$Context.bakeLayer(ModelLayerLocation)
```

## 实体属性注册

```java
// ① 原版属性：静态 createAttributes() + EntityAttributeCreationEvent.put（本档规则 04-entity.mdc:30）
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ModEntityAttributes {
    @SubscribeEvent
    public static void onAttributes(EntityAttributeCreationEvent event) {
        event.put(ModEntities.MY_ENTITY.get(), MyEntity.createAttributes().build());
    }
}

// ② 自定义 Attribute 才需要注册表（ForgeRegistries.ATTRIBUTES）
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID);

// 1.19.4 索引：RangedAttribute(String, double, double, double)、Attribute#setSyncable(boolean)
public static final RegistryObject<Attribute> EXTRA_HEALTH = ATTRIBUTES.register("extra_health",
    () -> new RangedAttribute("attribute.modid.extra_health", 0.0, 0.0, 1000.0).setSyncable(true)
);

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);

// ③ 把自定义属性并入生物：写进 createAttributes()，再由 EntityAttributeCreationEvent 生效
public static AttributeSupplier.Builder createAttributes() {
    return Mob.createMobAttributes()
        .add(Attributes.MAX_HEALTH, 20.0D)
        .add(EXTRA_HEALTH.get(), 0.0D);
}
```

> 1.20.1 档 `03-entity-patterns.md:126-128` 用的
> `this.getAttribute(ATTRIBUTES.get("extra_health")).ifPresent(attr -> this.getAttributeMap().registerAttribute(attr))`
> 不是 1.19.4 的注册路径（`ForgeRegistries.ATTRIBUTES` 里没有按字符串取值的 API），
> 本档按 `04-entity.mdc:30` / `knowledge/antipatterns/entity.md:36-48` 的 `EntityAttributeCreationEvent` 写法。
