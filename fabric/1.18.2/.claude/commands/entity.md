# Fabric 实体开发命令参考

本文件描述 Fabric 1.18.2 平台上进行实体（Entity）开发时所需掌握的核心 API 和常用命令。

## 核心注册命令

### Registry.register()

Fabric 中所有实体都必须通过 `Registry.register()` 方法注册到游戏注册表中。与 Forge 使用 modEventBus 和 `RegisterEvent` 不同，Fabric 在 `onInitialize()` 方法中直接调用注册方法。实体注册的基本格式为：`Registry.register(Registries.ENTITY_TYPE, new Identifier(MOD_ID, "entity_name"), entityTypeInstance)`。其中第一个参数指定注册表类型为 `ENTITY_TYPE`，第二个参数使用 `Identifier` 构造唯一标识符，第三个参数是 `EntityType` 实例。注册时机必须在 mod 初始化阶段完成，否则实体无法在游戏中出现。

### EntityType.Builder 创建命令

创建实体类型使用 `EntityType.Builder` 构建器。基本命令：`EntityType.Builder.create(EntityType.EntityFactory<T> factory, EntityCategory spawnGroup).dimensions(EntityDimensions).build()`。第一个参数是实体类的构造函数引用（`EntityType.EntityFactory<T>`），第二个参数 `EntityCategory` 指定实体的生成分类：`MOB`（怪物）、`CREATURE`（动物）、`AMBIENT`（环境生物如蝙蝠）、`WATER_CREATURE`（水中生物）、`WATER_AMBIENT`（水下生物）、`MISC`（杂项，不会在世界生成）。`dimensions()` 设置实体碰撞箱大小，`EntityDimensions.changing(width, height)` 用于随年龄变化的实体（如小猪），`EntityDimensions.fixed(width, height)` 用于固定大小的实体。

### Identifier 构造规范

实体注册名称必须使用全小写字母和下划线，mod ID 必须与 `fabric.mod.json` 中声明的完全一致。正确的示例：`new Identifier("examplemod", "my_entity")`。命名不一致会导致实体无法正确定位和生成。

### 实体类定义命令

创建自定义实体需要继承适当的基类。常用基类包括：`Entity`（基础实体），`LivingEntity`（有生命的实体，可携带属性），`MobEntity`（可自主移动的实体），`AnimalEntity`（动物，有繁殖逻辑），`TameableEntity`（可驯服实体），`Monster`（怪物，会主动攻击玩家）。基本命令：`public class MyEntity extends LivingEntity { public MyEntity(EntityType<MyEntity> type, World world) { super(type, world); } }`。构造函数必须接受 `EntityType` 和 `World` 参数并传递给父类。

## 属性注册命令

### DefaultAttributeRegistry.register()

实体的属性（最大生命值、移动速度、攻击伤害等）需要通过 `DefaultAttributeRegistry` 注册。基本命令：`DefaultAttributeRegistry.register(entityType, attributeSupplier)`。`attributeSupplier` 是一个接受 `Builder` 参数的函数，可以链式添加多个属性。常用属性包括：`EntityAttributes.GENERIC_MAX_HEALTH`（最大生命值，默认 20），`EntityAttributes.GENERIC_MOVEMENT_SPEED`（移动速度，默认 0.7），`EntityAttributes.GENERIC_ATTACK_DAMAGE`（攻击伤害，默认 2），`EntityAttributes.GENERIC_ARMOR`（护甲值），`EntityAttributes.GENERIC_FOLLOW_RANGE`（跟随范围）。

### 常用属性配置命令

`DefaultAttributeBuilder.create()` 提供基础属性配置，可在此基础上添加或修改：`DefaultAttributeRegistry.register(MY_ENTITY, DefaultAttributeBuilder.create().maxHealth(40.0).movementSpeed(0.25))`。

## 生成限制命令

### SpawnRestrictionRegistration

控制实体在世界中的自然生成需要设置生成限制。基本命令：`SpawnRestrictionRegistration.mobSpawn().register(entityType, location, heightmap, predicate)`。`location` 指定允许生成的位置：`ON_GROUND`（地面上）、`IN_AIR`（空中）、`IN_WATER`（水中）、`ON_GROUND_RESTRICED`（受限地面）。`heightmap` 指定用于检查的 `Heightmap.Type`：`MOTION_BLOCKING`（阻挡移动，包括液体）、`MOTION_BLOCKING_NO_LEAVES`（阻挡移动，不包括树叶）、`WORLD_SURFACE`（世界表面）。`predicate` 是 `EntityType.IEntityPredicate` 类型，检查实体是否可以生成。

### 自动生成禁用命令

如果实体不需要自然生成（仅通过刷怪蛋或代码生成），可以不设置 `SpawnRestriction`，或者使用命令显式禁用：`SpawnRestriction.remove(entityType)`。

## 实体渲染器命令

### EntityRendererRegistry.register()

实体渲染器必须在客户端入口点（`ClientModInitializer.onInitializeClient()`）中注册。基本命令：`EntityRendererRegistry.register(entityType, entityRendererFactory)`。`entityRendererFactory` 是一个接受 `EntityRendererDispatcher` 的函数，返回对应的 `EntityRenderer` 实例。渲染器注册后只有在客户端才会被实例化，服务端不会执行渲染相关代码。

### 常用渲染器创建命令

Fabric 提供了多种预设渲染器。`LivingEntityRenderer` 用于渲染有生命的实体，支持动画和装备层：`new LivingEntityRenderer<>(context.getModelLoader().getModelPart(modelId), new ModelClass(), float shadowRadius)`。`AnimalEntityRenderer` 是 `LivingEntityRenderer` 的子类，专用于动物：`new AnimalEntityRenderer<>(context.getModelLoader().getModelPart(EntityModelLayers.COW), new CowEntityModel(), 0.5f)`。`MobEntityRenderer` 用于怪物实体。`TexturedBullModel` 和其他模型类可以从 `EntityModelLayers` 获取模型部件。

### 模型层获取命令

`EntityRendererDispatcher` 提供 `getModelLoader()` 方法获取 `EntityModelLoader`，用于加载实体模型。基本命令：`context.getModelLoader().getModelPart(EntityModelLayers.COW)`。`EntityModelLayers` 包含预定义的模型层常量，如 `COW`、`PIG`、`SHEEP`、`SKELETON`、`ZOMBIE` 等。自定义模型需要使用 `EntityModelLayer` 注册宏定义。

## 刷怪蛋命令

### SpawnEggItem 注册命令

创建刷怪蛋物品用于在创造模式生成实体。基本命令：`Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_entity_spawn_egg"), new SpawnEggItem(entityType, backgroundColor, foregroundColor, new Item.Settings()))`。`backgroundColor` 和 `foregroundColor` 是十六进制颜色值（如 `0xA02724` 表示红色背景，`0xFFFFFF` 表示白色前景）。

## 客户端入口点配置命令

实体渲染器是客户端专用代码，必须在 `fabric.mod.json` 中正确配置入口点。基本配置：`{ "entrypoints": { "main": ["com.example.ExampleMod"], "client": ["com.example.ExampleModClient"] } }`。`main` entrypoint 处理服务端和共享逻辑，`client` entrypoint 处理客户端专用逻辑。客户端入口点类需要实现 `ClientModInitializer` 接口并重写 `onInitializeClient()` 方法。
