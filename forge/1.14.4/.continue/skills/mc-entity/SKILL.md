---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 目标、实体渲染器。触发词：实体、Entity、LivingEntity、EntityType、MobClassification、EntityRenderer
platform: forge
version: "1.14.4"
---

# 实体开发（Forge 1.14.4）

## 快速开始

```java
// 注册 EntityType（参见 mc-registry Skill）
public static final EntityType<MyEntity> MY_ENTITY =
    EntityType.Builder.create(MyEntity::new, MobClassification.CREATURE)
        .size(0.6f, 1.8f)
        .trackingRange(8)
        .updateInterval(3)
        .fireImmune()
        .build("my_entity");

@SubscribeEvent
public static void onEntitiesRegistry(final RegistryEvent.Register<EntityType> event) {
    event.getRegistry().register(
        MY_ENTITY.setRegistryName(new ResourceLocation(MOD_ID, "my_entity"))
    );
}
```

## 实体类基础结构

```java
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
        this.noPhysics = true;
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        // 注册实体属性（生命值、移动速度、攻击伤害等）
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
        this.getAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0);
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        this.goalSelector.addGoal(0, new SwimGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomWalkingGoal(this, 1.0));
        this.goalSelector.addGoal(3, new LookAtGoal(this, PlayerEntity.class, 8.0f));
        this.goalSelector.addGoal(4, new LookRandomlyGoal(this));

        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }
}
```

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 基础生物（动物/怪物） | `Animal`（支持繁殖） |
| 站立型实体（村民） | `LivingEntity` |
| 投掷物（雪球、末影珍珠） | `ThrowableEntity` |
| 物品实体 | `ItemEntity` |
| 矿车/船只 | `AbstractMinecart` / `BoatEntity` |
| 存储实体 | `TileEntity`（或 BlockEntity） |

## EntityRenderer 注册（客户端）

```java
// 客户端 — RenderingRegistry 中注册
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ClientSetup {
    @SubscribeEvent
    public static void setup(final FMLClientSetupEvent event) {
        RenderingRegistry.registerEntityRenderingHandler(
            ModEntities.MY_ENTITY,
            MyEntityRenderer::new
        );
    }
}

// 渲染器
public class MyEntityRenderer extends RenderLivingEntity<MyEntity> {
    public MyEntityRenderer(EntityRendererManager renderManager) {
        super(renderManager, new MyEntityModel<>(), 0.5f);
        this.addLayer(new ItemLayerRenderer<>(this, renderManager.getItemRenderer()));
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

## Decision: 渲染器类型选择

```
IF 基础渲染（无自定义模型）
  → 使用 RenderFactory 或直接注册空的 EntityRenderer

IF 覆盖默认 Steve 模型
  → 覆盖 PlayerRenderer

IF 自定义 Biped 模型
  → BipedModel + RenderBiped
```

## 常见错误

- ❌ `EntityType.Builder.create()` 第一个参数是 `EntityType.IFactory<Entity>`（构造函数引用），不是 Entity 实例
- ❌ 忘记 `ENTITY_TYPES.register(event)`（实体不注册）
- ❌ `RenderLiving`（不存在）→ 正确：`RenderLivingEntity`
- ❌ `RenderingRegistry.registerEntityRenderingHandler()`（旧 API）→ 正确：`RenderingRegistry.registerEntityRenderingHandler()`

## 参考资料

- 详细示例：参见 `04-entity.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体类型通过 RegistryEvent 注册 |
| `mc-capability` | 实体可附加 Capability（AttachCapabilitiesEvent） |
| `mc-datagen` | 实体注册后可生成实体战利品表 JSON（手动） |
