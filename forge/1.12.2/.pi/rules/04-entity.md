---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Forge 1.12.2

---

## 约束

### Entity 基础规范

- 实体类继承 `Entity`（基础）或 `EntityLiving`（可移动/有生命）
- 推荐继承 `EntityLiving`，除非需要完全自定义行为
- 实体必须通过 `RegistryEvent.Register<EntityEntry>` 注册（官方 Registries 页列出的类型含 `EntityEntry`）
- 用 `EntityEntryBuilder` 创建条目。`EntityEntryBuilder#id()` 相当于 `setRegistryName()`，并额外接收模组内部网络 int ID
- 官方 `mcmod.info` 字段表**没有** `entities` / `entityTypes`

### EntityEntryBuilder 配置

```java
EntityEntryBuilder.create()
    .entity(MyEntity.class)  // Class，不是构造方法引用
    .id(new ResourceLocation(MODID, "my_entity"), id)
    .name("my_entity")
    .egg(0xFFFFFF, 0xFFFFFF)
    .tracker(64, 3, true)
    .build();
```

`factory(Function<World, E>)` 可选。自然生成再链式 `.spawn(EnumCreatureType, weight, min, max, biomes)`。

### 实体属性（Attribute）

- 每个实体**必须**在 `applyEntityAttributes()` 里设置属性（先 `super`，再 `getEntityAttribute(...).setBaseValue(...)`）
- 不要抄 1.14+ 的 `createAttributes()`

### AI Goal

- 使用 `EntityAI*` 任务（`tasks.addTask` / `targetTasks.addTask`），不是 1.14+ 的 `Goal`
- 每个 EntityLiving 在 `initEntityAI()` 里添加任务

### 渲染器规范

- 渲染器必须放在 `client` 包下
- 必须通过 `RenderingRegistry.registerEntityRenderingHandler()` 注册
- 纹理文件路径：`textures/entity/{entity_path}/{name}.png`

---

## Decision Flow

### Decision: 选择实体基类

```
IF 实体需要移动、AI、装备栏、药水效果等
  → 继承 EntityLiving
  → 获得完整的实体行为系统

IF 实体是静态物品（掉落物、经验球等）
  → 使用现有的 EntityItem、EntityXPOrb 等
  → 通常不需要自定义 Entity

IF 实体需要完全控制渲染和碰撞
  → 继承 Entity（不推荐，需要大量手动实现）
```

### Decision: 选择生物分类

```
IF 自然生成的动物/怪物
  → EnumCreatureType.CREATURE（被动）
  → EnumCreatureType.MONSTER（敌对）
  → EnumCreatureType.WATER_CREATURE（水生）
  → EnumCreatureType.AMBIENT（环境，如蝙蝠）

IF 不自然生成
  → 不要调用 EntityEntryBuilder.spawn()
  → 本档没有 MobCategory（那是 1.17+ Mojmap）
```

### Decision: 渲染器选择

```
IF 基础实体（无自定义模型）
  → 使用默认渲染器

IF 覆盖默认渲染
  → 继承 RenderLiving 或直接注册 Render 类

IF 自定义模型
  → 继承 RenderLiving<Entity>
  → 在 Model 中实现自定义模型
  → 需要提供 .json 模型文件和材质贴图
```

---

## 示例：实体类

```java
// entities/EntityExample.java
public class EntityExample extends EntityLiving {
    public static final int TRACKING_RANGE = 64;
    public static final int UPDATE_RATE = 3;

    public EntityExample(World world) {
        super(world);
        setSize(0.6f, 1.8f);
    }

    @Override
    protected void applyEntityAttributes() {
        super.applyEntityAttributes();
        this.getEntityAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0D);
        this.getEntityAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3D);
    }

    @Override
    protected void initEntityAI() {
        this.tasks.addTask(0, new EntityAISwimming(this));
        this.tasks.addTask(1, new EntityAIAttackMelee(this, 1.0D, true));
        this.tasks.addTask(2, new EntityAIWanderAvoidWater(this, 1.0D));
        this.tasks.addTask(3, new EntityAIWatchClosest(this, EntityPlayer.class, 8.0F));
        this.tasks.addTask(4, new EntityAILookIdle(this));
        this.targetTasks.addTask(0, new EntityAIHurtByTarget(this, true));
        this.targetTasks.addTask(1, new EntityAINearestAttackableTarget(this, EntityPlayer.class, true));
    }
}
```

## 示例：实体注册

```java
// registry/ModEntities.java
@Mod.EventBusSubscriber(modid = ExampleMod.MODID)
public class ModEntities {
    public static EntityEntry EXAMPLE_ENTITY;

    @SubscribeEvent
    public static void registerEntities(RegistryEvent.Register<EntityEntry> event) {
        EXAMPLE_ENTITY = EntityEntryBuilder.create()
                .entity(EntityExample.class)
                .id(new ResourceLocation(ExampleMod.MODID, "example_entity"), 0)
                .name("example_entity")
                .tracker(64, 3, true)
                .egg(0xFF0000, 0x00FF00)
                .build();

        event.getRegistry().register(EXAMPLE_ENTITY);
    }
}
```

```java
// 官方 gettingstarted/structuring 的 mcmod.info 字段表没有 entityTypes
```

## 示例：客户端渲染器注册

```java
// proxy/ClientProxy.java
@SideOnly(Side.CLIENT)
public class ClientProxy extends CommonProxy {
    @Override
    public void preInit(FMLPreInitializationEvent event) {
        super.preInit(event);
        RenderingRegistry.registerEntityRenderingHandler(EntityExample.class,
            new IRenderFactory<EntityExample>() {
                @Override
                public Render<? super EntityExample> createRenderFor(RenderManager manager) {
                    return new RenderLiving<EntityExample>(manager, new ModelBiped(), 0.5F) {
                        @Override
                        protected ResourceLocation getEntityTexture(EntityExample entity) {
                            return new ResourceLocation(ExampleMod.MODID,
                                "textures/entity/example_entity.png");
                        }
                    };
                }
            });
    }
}
```

> 注意：
> 1. 实体渲染器通过 `RenderingRegistry.registerEntityRenderingHandler()` 注册
> 2. 纹理文件路径：`textures/entity/example_entity.png`（对应 `assets/{modid}/textures/entity/example_entity.png`）
> 3. 不要在 `mcmod.info` 里编 `entityTypes` 字段（官方字段表没有）
