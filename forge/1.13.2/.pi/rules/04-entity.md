---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Forge 1.13.2

---

## 约束

### Entity 基础规范

- 实体类继承 `LivingEntity`（可移动/有生命）或 `Entity`（基础）
- 推荐继承 `LivingEntity`，除非需要完全自定义行为
- 实体必须通过 `RegistryEvent.Register<EntityType>` 注册
- 必须在 `mods.toml` 中添加 `[[entities]]` 声明

### EntityType.Builder 配置

```java
EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
    .size(float width, float height)             // 碰撞箱大小
    .trackingRange(int range)                   // 客户端追踪范围
    .updateInterval(int ticks)                  // 服务端更新间隔
    .fireImmune()                              // 免疫火焰伤害
    .build(String modId)
```

### 实体属性（Attribute）

- 每个实体**必须**在 `registerAttributes()` 方法中注册属性
- 属性注册在实体类内部处理，不需要通过事件系统

### AI Goal / Target Goal

- 使用 `Goal` 实现自主行为（行走、攻击、飞行等）
- 使用 `TargetGoal` 实现目标选择逻辑
- 每个 Entity 实例创建对应的 `GoalFloat`、`LookAtGoal` 等

### 渲染器规范

- 渲染器必须放在客户端包下
- 必须通过 `RenderingRegistry.registerEntityRenderingHandler()` 注册
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

### Decision: 选择 MobCategory（生物分类）

```
IF 自然生成的动物/怪物
  → MobCategory.CREATURE（被动生物）
  → MobCategory.MONSTER（敌对生物）
  → MobCategory.WATER_CREATURE（水生生物）
  → MobCategory.AMBIENT（环境生物，如蝙蝠）

IF NPC 或乘客
  → MobCategory.MISC（杂项）
  → 不会自然生成

IF 乘坐实体
  → 使用 MobCategory.MISC 或在实体类中覆盖 getType().getCategory()
```

### Decision: 渲染器选择

```
IF 基础实体（无自定义模型）
  → 使用 RenderLiving 配合内置模型

IF 覆盖默认 Steve 模型
  → 覆盖 LivingRenderer

IF 自定义模型（Biped、Quadruped 等）
  → 继承对应基类：RenderLiving<Entity, Model>
  → 需要提供 .json 模型文件和材质贴图
```

---

## 示例：定义实体属性

```java
// entities/MyEntity.java
public class MyEntity extends LivingEntity {
    private int attackCooldown = 0;

    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        // 注册实体属性
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
        this.goalSelector.addGoal(4, new RandomLookAroundGoal(this));

        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }
}
```

## 示例：实体注册

```java
// registry/ModEntities.java
public class ModEntities {
    public static final EntityType<MyEntity> MY_ENTITY =
        EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
            .size(0.6f, 1.8f)
            .trackingRange(8)
            .updateInterval(3)
            .fireImmune()
            .build("my_entity");

    public static void register() {
        MY_ENTITY.setRegistryName(new ResourceLocation(MOD_ID, "my_entity"));
    }
}
```

```java
// ExampleMod.java
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    // ...
    @SubscribeEvent
    public void onEntitiesRegistry(RegistryEvent.Register<EntityType<?>> event) {
        event.getRegistry().register(ModEntities.MY_ENTITY);
    }
}
```

```java
// ❌ 错误示例：没有 setRegistryName
event.getRegistry().register(
    EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE).build("my_entity")
); // 没有注册名，无法引用
```

## 示例：客户端渲染器注册

```java
// client/ClientSetup.java
public class ClientSetup {
    public static void register() {
        RenderingRegistry.registerEntityRenderingHandler(
            ModEntities.MY_ENTITY,
            MyEntityRenderer::new
        );
    }
}
```

```java
// client/rendering/MyEntityRenderer.java
public class MyEntityRenderer extends RenderLiving<MyEntity> {
    public MyEntityRenderer(EntityRendererManager manager) {
        super(manager, new MyEntityModel(), 0.5f);
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(ExampleMod.MOD_ID, "textures/entity/my_entity.png");
    }
}
```

> 注意：
> 1. `RenderingRegistry` 在 Forge 1.13.2 中用于注册实体渲染器
> 2. 纹理文件路径：`textures/entity/my_entity.png`（对应 `assets/{modid}/textures/entity/my_entity.png`）
> 3. 使用 `RenderLiving` 作为基类配合 `Model` 实现自定义模型
