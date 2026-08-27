---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Forge 1.15.2

---

## 约束

### Entity 基础规范

- 实体类继承 `LivingEntity`（可移动/有生命）或 `Entity`（基础）
- 推荐继承 `LivingEntity`，除非需要完全自定义行为
- 实体必须通过 `DeferredRegister<EntityType>` 注册
- 实体用 `DeferredRegister` 注册。官方 `mods.toml` **没有** `[[entities]]` 表（常见是 `[[mods]]` / `[[dependencies.*]]`）；不要编实体 TOML 段

### EntityType.Builder 配置

```java
EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
    .size(float width, float height)
    .setTrackingRange(int range)
    .setUpdateInterval(int ticks)
    .immuneToFire()
    .build("")
```

### 实体属性（Attribute）

- 本档**没有** `ForgeRegistries.ATTRIBUTES`
- 在实体类重写 `registerAttributes()`，用 `SharedMonsterAttributes`
- **禁止**在 Entity 构造函数中改属性

### AI Goal / Target Goal

- 使用 `Goal` 实现自主行为（行走、攻击、飞行等）
- 使用 `TargetGoal` 实现目标选择逻辑
- 每个 Entity 实例创建对应的 `SwimGoal`、`LookAtGoal` 等

### 渲染器规范

- 渲染器必须放在 `client` 包下
- 必须通过 `RenderingRegistry.registerEntityRenderingHandler()` 注册
- 必须在 `FMLClientSetupEvent` 中订阅注册
- 纹理文件路径：`textures/entity/{entity_path}/{name}.png`

---

## Decision Flow

### Decision: 选择实体基类

```
IF 实体需要移动、AI、装备栏、药水效果等
  → 继承 LivingEntity
  → 获得完整的实体行为系统

IF 实体是静态物品（掉落物、经验球等）
  → 使用现有的 ItemEntity、ExperienceOrb 等
  → 通常不需要自定义 Entity

IF 实体需要完全控制渲染和碰撞
  → 继承 Entity（不推荐，需要大量手动实现）
```

### Decision: 选择 EntityClassification（生物分类）

```
IF 自然生成的动物/怪物
  → EntityClassification.CREATURE（被动生物）
  → EntityClassification.MONSTER（敌对生物）
  → EntityClassification.WATER_CREATURE（水生生物）
  → EntityClassification.AMBIENT（环境生物，如蝙蝠）

IF NPC 或乘客
  → EntityClassification.MISC（杂项）
  → 不会自然生成

IF 乘坐实体
  → 使用 EntityClassification.MISC 或在实体类中覆盖 getType().getClassification()
```

### Decision: 属性注册时机

```
IF 在 Mod init 中直接注册属性（不使用 DeferredRegister）
  → ❌ 错误：太早，Attributes 系统未就绪

IF 使用 DeferredRegister + modEventBus
  → ✅ 正确：在 mod 构造函数中通过 modEventBus 完成
  → 属性系统已在 modEventBus 阶段就绪

IF 在 FMLCommonSetupEvent.enqueueWork() 中注册
  → ⚠️ 可用但不推荐：已有 DeferredRegister 方案更简洁
```

### Decision: 渲染器选择

```
IF 基础实体（无自定义模型）
  → 使用 RenderRegistry 或直接注册空的 EntityRenderer

IF 覆盖默认 Steve 模型
  → 覆盖 PlayerRenderer

IF 自定义模型（Biped、Quadruped 等）
  → 继承对应基类：LivingRenderer<Entity, Model>
  → 在 BakedModel 中实现自定义模型
  → 需要提供 .json 模型文件和材质贴图
```

---

## 示例：定义实体属性

```java
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0D);
    this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.25D);
}
```

## 示例：实体类

```java
// entities/MyEntity.java
public class MyEntity extends LivingEntity {
    private int attackCooldown = 0;

    protected MyEntity(EntityType<? extends MyEntity> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        this.goalSelector.addGoal(0, new SwimGoal(this));           // 游泳
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));  // 近战攻击
        this.goalSelector.addGoal(2, new WaterAvoidingRandomWalkingGoal(this, 1.0));
        this.goalSelector.addGoal(3, new LookAtGoal(this, PlayerEntity.class, 8.0f));
        this.goalSelector.addGoal(4, new RandomLookAroundGoal(this));

        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
        this.getAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0);
    }
}
```

## 示例：实体注册

```java
// registry/ModEntities.java
public class ModEntities {
    public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
        DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID);

    public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY =
        ENTITY_TYPES.register("my_entity", () ->
            EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
                .size(0.6f, 1.8f)
                .setTrackingRange(8)
                .setUpdateInterval(3)
                .immuneToFire()
                .build("my_entity")
        );

    public static void register(IEventBus eventBus) {
        ENTITY_TYPES.register(eventBus);
    }
}
```

```java
// ExampleMod.java 构造函数中
public ExampleMod() {
    IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
    ModEntities.register(modEventBus);
}
```

```java
// ❌ 错误示例：setRegistryName + 直接 new（已过时）
event.getRegistry().register(
    EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
        ...
        .build("my_mod:my_entity")
);
type.setRegistryName(new ResourceLocation(MOD_ID, "my_entity"));
```

## 示例：客户端渲染器注册

```java
// client/ClientSetup.java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        // 渲染器通过 RenderingRegistry.registerEntityRenderingHandler 注册
        RenderingRegistry.registerEntityRenderingHandler(
            ModEntities.MY_ENTITY.get(),
            manager -> new MyEntityRenderer(manager, new MyEntityModel<>(), 0.5f)
        );
    }
}
```

## 示例：渲染器

```java
// client/rendering/MyEntityRenderer.java
public class MyEntityRenderer extends LivingRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererManager manager, MyEntityModel<MyEntity> model, float shadow) {
        super(manager, model, shadow);
    }

    @Override
    public ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(ExampleMod.MOD_ID, "textures/entity/my_entity.png");
    }
}
```

> 注意：
> 1. `RenderingRegistry` 在 Forge 1.15.2 中用于注册实体渲染器
> 2. 纹理文件路径：`textures/entity/my_entity.png`（对应 `assets/{modid}/textures/entity/my_entity.png`）
> 3. 1.15.2 **没有** `EntityModelLayer`（那是 1.17+）；用本档 EntityModel / 渲染器注册
