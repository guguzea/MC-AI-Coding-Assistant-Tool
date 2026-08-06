---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 目标、实体渲染器。触发词：实体、Entity、LivingEntity、EntityType、MobCategory
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 实体开发（Forge 1.15.2）

## 快速开始

```java
// 注册 EntityType（参见 mc-registry Skill）
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
        .size(0.6f, 1.8f)
        .trackerTrackingRange(8)
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
        this.noClip = true;
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        // 添加 AI 目标
        this.goalSelector.addGoal(0, new SwimGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomWalkingGoal(this, 1.0));
        this.goalSelector.addGoal(3, new LookAtGoal(this, PlayerEntity.class, 8.0f));
        this.goalSelector.addGoal(4, new RandomLookAroundGoal(this));
        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        // 注册实体属性（生命值、移动速度、攻击伤害等）
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
        this.getAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0);
    }
}
```

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 基础生物（动物/怪物） | `Animal`（支持繁殖） |
| 站立型实体（村民） | `LivingEntity` |
| 投掷物（雪球、末影珍珠） | `Projectile` |
| 物品实体 | `ItemEntity` |
| 矿车/船只 | `AbstractMinecart` / `Boat` |

## EntityRenderer 注册（客户端）

```java
// 客户端 — FMLClientSetupEvent 中注册
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        RenderingRegistry.registerEntityRenderingHandler(
            MyEntity.TYPE.get(),
            MyEntityRenderer::new
        );
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

## 常见错误

- ❌ `EntityType.Builder.create()` 第一个参数是构造函数引用，不是 Entity 实例
- ❌ 忘记 `ENTITY_TYPES.register(modEventBus)`（实体不注册）
- ❌ `RenderingRegistry` 在服务端调用 → 仅限客户端

## 参考资料

- 详细示例：参见 `04-entity.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体类型通过 DeferredRegister 注册 |
| `mc-capability` | 实体可附加 Capability |
| `mc-datagen` | 实体注册后可生成实体战利品表 JSON |
