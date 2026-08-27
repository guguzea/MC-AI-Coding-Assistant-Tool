---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 目标、实体渲染器。触发词：实体、Entity、LivingEntity、EntityType、EntityClassification、EntityRenderer
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 实体开发（Forge 1.16.5）

## 快速开始

```java
// 注册 EntityType（参见 mc-registry Skill）
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, EntityClassification.CREATURE)
        .sized(0.6f, 1.8f)
        .clientTrackingRange(8)
        .updateInterval(3)
        .fireImmune()
    .build("my_entity")
);

// 在 mod 构造函数中
ENTITY_TYPES.register(modEventBus);
```

## 实体类基础结构

```java
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<? extends MyEntity> type, World world) {
        super(type, world);
        this.stepHeight = 1.0F;
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        // 添加 AI 目标
        this.goalSelector.addGoal(0, new FloatGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomStrollGoal(this, 1.0));
        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }

    public static AttributeModifierMap.MutableAttribute createAttributes() {
        return MobEntity.createMobAttributes()
            .add(Attributes.MAX_HEALTH, 20.0D)
            .add(Attributes.MOVEMENT_SPEED, 0.3D)
            .add(Attributes.ATTACK_DAMAGE, 3.0D);
    }
}
```

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 基础生物（动物/怪物） | `AnimalEntity`（支持繁殖） |
| 站立型实体 | `LivingEntity` |
| 投掷物（雪球、末影珍珠） | `ThrowableEntity` |
| 物品实体 | `ItemEntity` |
| 矿车/船只 | `AbstractMinecartEntity` / `BoatEntity` |
| 存储实体 | `ILockableContainer`（或 BlockEntity） |

## EntityRenderer 注册（客户端）

```java
// 客户端 — FMLClientSetupEvent + RenderingRegistry（本档没有 EntityRenderersEvent）
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        RenderingRegistry.registerEntityRenderingHandler(MY_ENTITY.get(), MyEntityRenderer::new);
    }
}

// 渲染器
public class MyEntityRenderer extends LivingEntityRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererManager manager) {
        super(manager, new MyEntityModel<>(), 0.5f);
    }

    @Override
    public ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

## Decision: 渲染器类型选择

```
IF 基础渲染（无自定义模型）
  → 直接使用空的 LivingEntityRenderer 或已有渲染器

IF 自定义 Biped 模型
  → BipedModel + HumanoidMobRenderer

IF 自定义任意模型
  → EntityModel + ModelPart
  → 本档没有 EntityRenderersEvent；用 RenderingRegistry.registerEntityRenderingHandler
```

## 常见错误

- ❌ `EntityType.Builder.of()` 第一个参数是 `EntityType.IFactory<Entity>`（构造函数引用），不是 Entity 实例
- ❌ `EntityType.Builder.build()` 接受 String 参数，不是 Direction
- ❌ 忘记 `ENTITY_TYPES.register(modEventBus)`（实体不注册）
- ❌ `LivingRenderer`（不存在）→ 正确：`LivingEntityRenderer`

## 参考资料

- 详细示例：参见 `04-entity.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体类型通过 DeferredRegister 注册 |
| `mc-capability` | 实体可附加 Capability（AttachCapabilitiesEvent） |
| `mc-datagen` | 实体注册后可生成实体战利品表 JSON |
