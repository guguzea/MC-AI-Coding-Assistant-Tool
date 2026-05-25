---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 目标、实体渲染器。触发词：实体、Entity、LivingEntity、EntityType、MobCategory、EntityRenderer
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 实体开发（Forge 1.20.1）

## 快速开始

```java
// 注册 EntityType（参见 mc-registry Skill）
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
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
    protected MyEntity(EntityType<? extends MyEntity> type, Level level) {
        super(type, level);
        this.noPhysics = true;
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        // 添加 AI 目标
        this.goalSelector.addGoal(0, new FloatGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomStrollGoal(this, 1.0));
        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, Player.class, true));
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        // 注册实体属性（生命值、移动速度、攻击伤害等）
        this.getAttribute(Attributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(Attributes.MOVEMENT_SPEED).setBaseValue(0.3);
        this.getAttribute(Attributes.ATTACK_DAMAGE).setBaseValue(3.0);
        // 自定义属性
        this.getAttribute(Attributes.ATTACK_KNOCKBACK).setBaseValue(0.5);
    }

    @Override
    protected void defineSynchedData() {
        super.defineSynchedData();
        // 同步数据（EntityDataAccessor）
        this.entityData.define(DATA_ID, 0);
    }
}
```

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 基础生物（动物/怪物） | `Animal`（支持繁殖） |
| 站立型实体（村民、村民） | `LivingEntity` |
| 投掷物（雪球、末影珍珠） | `Projectile` |
| 物品实体 | `ItemEntity` |
| 矿车/船只 | `AbstractMinecart` / `Boat` |
| 存储实体 | `StorageEntity`（或 BlockEntity） |

## EntityRenderer 注册（客户端）

```java
// 客户端 — EntityRenderersEvent.RegisterRenderers 中注册
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onRegisterRenderers(EntityRenderersEvent.RegisterRenderers event) {
        event.registerEntityRenderer(MyEntity.TYPE.get(), MyEntityRenderer::new);
    }
}

// 渲染器
public class MyEntityRenderer extends LivingEntityRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererProvider.Context context) {
        super(context, new MyEntityModel<>(context.bakeLayer(MyEntityModel.LAYER_LOCATION)), 0.5f);
        // 添加层（如 ItemInHandLayer）
        this.addLayer(new ItemInHandLayer<>(this,
            context.getItemRenderer(), context.getBlockRenderer()));
    }

    @Override
    public ResourceLocation getTextureLocation(MyEntity entity) {
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
  → EntityModel + LayerDefinition + bakeLayer()
  → 通过 EntityRenderersEvent.RegisterLayerDefinitions 注册 ModelLayer
```

## 实体数据同步（服务端 ↔ 客户端）

```java
// 定义同步数据标识符
private static final EntityDataAccessor<Integer> DATA_HEALTH =
    SynchedEntityData.defineId(MyEntity.class, EntityDataSerializers.INT);

// 读取/设置
this.entityData.get(DATA_HEALTH);    // 读取
this.entityData.set(DATA_HEALTH, 50); // 设置（自动同步）
```

## 常见错误

- ❌ `EntityType.Builder.of()` 第一个参数是 `EntityType.IFactory<Entity>`（构造函数引用），不是 Entity 实例
- ❌ `EntityType.Builder.build()` 接受 String 参数，不是 Direction
- ❌ 忘记 `ENTITY_TYPES.register(modEventBus)`（实体不注册）
- ❌ `LivingRenderer`（不存在）→ 正确：`LivingEntityRenderer`
- ❌ `EntityRenderers.register()`（旧 API）→ 正确：`EntityRenderersEvent.RegisterRenderers`

## 参考资料

- 详细示例：参见 `04-entity.mdc`

## 实体动画（Forge 1.20.1）

> **注意**：Forge 的 ASM 动画 API（`IAnimationStateMachine` / `AnimationTESR`）在 1.18 已移除。1.20.1 的实体动画依赖 vanilla 内置系统，无需任何 Forge 特有代码。复杂动画推荐使用 **GeckoLib**（第三方库）。

### Vanilla 动画系统（内置）

基础：`HierarchicalModel<Entity>` + `AnimationState` + `AnimationDefinition`

```java
// 实体模型类
public class MyEntityModel extends HierarchicalModel<MyEntity> {
    public static final ModelLayerLocation LAYER_LOCATION =
        new ModelLayerLocation(new ResourceLocation(MOD_ID, "my_entity"), "main");

    @Override
    public void setupAnim(MyEntity entity, float limbSwing, float limbSwingAmount,
                          float ageInTicks, float netHeadYaw, float headPitch) {
        // 行走动画
        this.animateWalk(MyEntityAnimations.WALK, limbSwing, limbSwingAmount, 2.0f, 2.5f);

        // 闲置动画
        this.animate(entity.idleAnimationState, MyEntityAnimations.IDLE, ageInTicks);
    }

    @Override
    public ModelRenderer root() { return body; }
}
```

在 `EntityRenderersEvent.RegisterLayerDefinitions` 中注册模型层：

```java
@SubscribeEvent
public static void registerLayerDefinitions(EntityRenderersEvent.RegisterLayerDefinitions event) {
    event.registerLayerDefinition(MyEntityModel.LAYER_LOCATION, MyEntityModel::createBodyLayer);
}
```

`AnimationDefinition` JSON 放在 `assets/<modid>/animations/<entity>.json`：

```json
{
  "format_version": [1, 20, 0],
  "animations": {
    "walk": {
      "loop": true,
      "animation_length": 0.666,
      "bones": {
        "body": {
          "rotation": {
            "0.0": [0, 0, 0],
            "0.666": [0, 360, 0]
          }
        }
      }
    },
    "idle": {
      "loop": true,
      "animation_length": 3.0,
      "bones": {
        "body": {
          "rotation": {
            "0.0": [0, 0, 0],
            "1.5": [0, 5, 0],
            "3.0": [0, 0, 0]
          }
        }
      }
    }
  }
}
```

### 在服务端触发动画

```java
public class MyEntity extends LivingEntity {
    private final AnimationState idleAnimationState = new AnimationState();

    @Override
    public void animateTick() {
        super.animateTick();
        if (!this.level().isClientSide) return;
        // 客户端：驱动动画状态机
        this.idleAnimationState.tryTransition(MyEntityModel.ANIMATION_LOCATION);
    }
}
```

### GeckoLib（复杂动画推荐）

对于多段动画、骨骼层级、程序化控制，推荐使用 GeckoLib：

1. 添加依赖：`GeckoLib` mod（Fabric/Forge 通用）
2. 模型改为 `.geo.json`（GeoMaid 或 Cubik Studio 导出）
3. `EntityRenderer` 继承 `GeoEntityRenderer`
4. 动画文件使用 `.json` 格式放在 `animations/`

> GeckoLib 是社区最主流的动画方案，文档：https:///geckolib.com/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体类型通过 DeferredRegister 注册 |
| `mc-capability` | 实体可附加 Capability（AttachCapabilitiesEvent） |
| `mc-datagen` | 实体注册后可生成实体战利品表 JSON |
