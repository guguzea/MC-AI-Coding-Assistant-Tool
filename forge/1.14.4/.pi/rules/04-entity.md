---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Forge 1.14.4

---

## 约束

### Entity 基础规范

- 实体类继承 `LivingEntity`（可移动/有生命）或 `Entity`（基础）
- 推荐继承 `LivingEntity`，除非需要完全自定义行为
- 实体必须通过 `DeferredRegister<EntityType>` 注册
- 必须在 `mods.toml` 中添加 `[[entities]]` 声明

### EntityType.Builder 配置

```java
EntityType.Builder.<MyEntity>create(MyEntity::new, MobCategory.CREATURE)
    .size(float width, float height)                  // 碰撞箱大小
    .trackingRange(int range)                         // 客户端追踪范围
    .updateInterval(int ticks)                        // 服务端更新间隔
    .fireImmune()                                    // 免疫火焰伤害
    .build(String modId)
```

### 实体属性（Attribute）

- 每个实体**必须**通过 `DeferredRegister<Attribute>` 注册属性（最大生命值、攻击伤害、移动速度等）
- 属性注册在 mod 构造函数中通过 modEventBus 完成（使用 DeferredRegister）
- **禁止**在 Entity 构造函数中注册属性（太早，属性系统尚未初始化）

### AI Goal / Target Goal

- 使用 `Goal` 实现自主行为（行走、攻击、飞行等）
- 使用 `TargetGoal` 实现目标选择逻辑
- 每个 Entity 实例创建对应的 `WaterBoundGoal`、`LookAtGoal` 等

### 渲染器规范

- 渲染器必须放在 `client` 包下
- 必须通过 `RenderingRegistry.registerEntityRenderingHandler()` 注册
- 必须在 `FMLClientSetupEvent` 中订阅客户端设置
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
  → 使用 Layers 或直接注册空的 Render
IF 覆盖默认 Steve 模型
  → 覆盖 PlayerRenderer

IF 自定义模型（Biped、Quadruped 等）
  → 继承对应基类：RenderLiving<Entity, Model>
  → 在 ModelBase 中实现自定义模型
  → 需要提供 .json 模型文件和材质贴图
```

---

## 示例：定义实体属性

```java
// init/ModAttributes.java
public class ModAttributes {
    // 推荐：使用 DeferredRegister（需 modEventBus）
    public static final DeferredRegister<Attribute> ATTRIBUTES =
        DeferredRegister.create(ForgeRegistries.ATTRIBUTES, ExampleMod.MOD_ID);

    public static final RegistryObject<Attribute> EXAMPLE_HEALTH =
        ATTRIBUTES.register("example.health",
            () -> new RangedAttribute("attribute.examplemod.health", 100.0, 1.0, 1024.0).setShouldWatch(true));

    public static final RegistryObject<Attribute> EXAMPLE_DAMAGE =
        ATTRIBUTES.register("example.damage",
            () -> new RangedAttribute("attribute.examplemod.damage", 2.0, 0.0, 1024.0).setShouldWatch(true));

    public static void register(IEventBus eventBus) {
        ATTRIBUTES.register(eventBus);
    }
}
```

```java
// ExampleMod.java 构造函数中
public ExampleMod() {
    IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
    ModAttributes.register(modEventBus);
    // ... 其他注册
}
```

> 注意：`ForgeRegistries.ATTRIBUTES` 是注册表，`DeferredRegister.create()` 需要传入 `IRegistry` 而非 `ResourceKey`。属性注册在 mod 构造函数中通过 modEventBus 完成，而不是在 `FMLCommonSetupEvent` 中。

## 示例：实体类

```java
// entities/MyEntity.java
public class MyEntity extends LivingEntity {
    private int attackCooldown = 0;

    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
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
    public static final DeferredRegister<EntityType<?>> ENTITIES =
        DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID);

    public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY =
        ENTITIES.register("my_entity", () ->
            EntityType.Builder.<MyEntity>create(MyEntity::new, MobCategory.CREATURE)
                .size(0.6f, 1.8f)
                .trackingRange(8)
                .updateInterval(3)
                .fireImmune()
                .build(MOD_ID + ":my_entity")
        );

    public static void register(IEventBus eventBus) {
        ENTITIES.register(eventBus);
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
    EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
        ...
        .build("my_mod:my_entity")
);
type.setRegistryName(new ResourceLocation(MOD_ID, "my_entity"));
```

## 示例：客户端渲染器注册

```java
// client/ClientSetup.java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID, bus = Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        // 渲染器通过 RenderingRegistry.registerEntityRenderingHandler 注册
        RenderingRegistry.registerEntityRenderingHandler(
            ModEntities.MY_ENTITY.get(),
            MyEntityRenderer::new
        );
    }
}
```

## 示例：渲染器

```java
// client/rendering/MyEntityRenderer.java
public class MyEntityRenderer extends LivingRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererManager renderManager) {
        super(renderManager, new MyEntityModel<>(), 0.5f);
        this.addLayer(new HeldItemLayer<>(this, this.getRenderManager().getItemRenderer()));
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(ExampleMod.MOD_ID, "textures/entity/my_entity.png");
    }
}
```

> 注意：
> 1. `RenderingRegistry` 在 Forge 1.14.4 中通过 `FMLClientSetupEvent` 注册（不是 `EntityRenderersEvent`）
> 2. `HeldItemLayer` 需要 `EntityRendererManager` 中的 `ItemRenderer`
> 3. 纹理文件路径：`textures/entity/my_entity.png`（对应 `assets/{modid}/textures/entity/my_entity.png`）
> 4. `ModelLayer` 用于定义层标识，通过 `RenderingRegistry` 注册，渲染器中用 `ModelHelper` 获取
