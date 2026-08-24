---
id: authored/custom-mob-entity-pipeline
title: 自定义生物全链路（EntityType → 属性/AI → 渲染器）
tags: [entity, mob, EntityType, PathfinderMob, attributes, goals, renderer, renderstate, spawn-egg, neoforge]
summary: EntityType 注册与 sized 碰撞箱；PathfinderMob 子类 registerGoals AI 优先级、createAttributes 静态工厂；EntityAttributeCreationEvent 绑定属性；渲染器两代模式（1.21.x render() vs 26.x RenderState/submit）；AnimationState 动画；刷怪蛋与生成。
mcHint: NeoForge（1.21.x 与 26.X 两套渲染器均已核对）；Forge 同构
sourceKind: authored
---

# 自定义生物全链路

自写短文。代码依据 Kaupenjoe NeoForge 课程：26.X 分支 `77-mob`（Penguin）+ NeoForge-Tutorial-1.21.X 分支 `39-customMob`（Gecko），MIT，均逐行核对。

## 第一步：注册 EntityType

```java
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.createEntities(MOD_ID);   // 26.x；旧版用 DeferredRegister.create(Registries.ENTITY_TYPE, MOD_ID)

public static final ResourceKey<EntityType<?>> PENGUIN_KEY =
    ResourceKey.create(Registries.ENTITY_TYPE, Identifier.fromNamespaceAndPath(MOD_ID, "penguin"));

public static final Supplier<EntityType<PenguinEntity>> PENGUIN = ENTITY_TYPES.register("penguin",
    () -> EntityType.Builder.of(PenguinEntity::new, MobCategory.CREATURE)
        .sized(0.75f, 1.25f)          // 碰撞箱宽、高
        .build(PENGUIN_KEY));
```

- `MobCategory` 影响生成与持久化：CREATURE（动物）/ MONSTER / MISC 等。
- 构造器签名必须是 `(EntityType<?>, Level)`——父类构造器原样透传。

## 第二步：实体类——AI 目标与属性

```java
public class PenguinEntity extends PathfinderMob {   // 温和生物基类；敌对用 Monster
    @Override
    protected void registerGoals() {
        goalSelector.addGoal(0, new FloatGoal(this));            // 数字=优先级，小的先执行
        goalSelector.addGoal(1, new PanicGoal(this, 2d));
        goalSelector.addGoal(2, new TemptGoal(this, 1.25d, s -> s.is(ItemTags.FISHES), false));
        goalSelector.addGoal(3, new WaterAvoidingRandomStrollGoal(this, 1f));
        goalSelector.addGoal(4, new LookAtPlayerGoal(this, Player.class, 6f));
        goalSelector.addGoal(5, new RandomLookAroundGoal(this));
    }

    public static AttributeSupplier.Builder createPenguinAttributes() {
        return PathfinderMob.createLivingAttributes()
            .add(Attributes.MAX_HEALTH, 10d)
            .add(Attributes.MOVEMENT_SPEED, 0.25d)
            .add(Attributes.FOLLOW_RANGE, 16d);
    }
}
```

- **属性必须静态工厂方法**，因为要在事件里注册（实体实例还不存在时就要给默认值）。
- 忘加常用属性（如 MOVEMENT_SPEED）→ 生物站桩或 NPE；`createLivingAttributes()` 已含基础集，按需 add。
- 目标选择器：同一优先级内可并存多个 goal，但互斥组由 goal 内部 flag 决定（move/look）。

## 第三步：绑定属性（游戏总线事件）

```java
@SubscribeEvent  // @EventBusSubscriber(modid=...) 默认总线
public static void registerAttributes(EntityAttributeCreationEvent event) {
    event.put(ModEntities.PENGUIN.get(), PenguinEntity.createPenguinAttributes().build());
}
```

漏了这步 → 生成实体即崩（attributes 为 null）。这是实体开发第一高频坑。

## 第四步：客户端渲染器（注意两代 API）

| | 1.21.x | 26.x |
|--|--------|------|
| 泛型 | `MobRenderer<E, M extends EntityModel<E>>` | `MobRenderer<E, RenderState, M>` |
| 贴图 | `getTextureLocation(E entity)` | `getTextureLocation(RenderState state)` |
| 每帧绘制 | 重写 `render(E, yaw, partialTicks, PoseStack, MultiBufferSource, packedLight)` | 状态抽取 `extractRenderState(...)` + `submit(state, PoseStack, SubmitNodeCollector, camera)` |

```java
// 1.21.x 写法（Gecko）
public class GeckoRenderer extends MobRenderer<GeckoEntity, GeckoModel<GeckoEntity>> {
    public GeckoRenderer(EntityRendererProvider.Context ctx) {
        super(ctx, new GeckoModel<>(ctx.bakeLayer(GeckoModel.LAYER_LOCATION)), 0.25f); // 0.25f=阴影大小
    }
    @Override public ResourceLocation getTextureLocation(GeckoEntity e) {
        return ResourceLocation.fromNamespaceAndPath(MOD_ID, "textures/entity/gecko/gecko_blue.png");
    }
}
```

- 26.x 的 RenderState 中间层：`createRenderState()` 建空状态、`extractRenderState` 在主线程外安全拷贝字段到 state（如把实体的 `AnimationState.copyFrom` 进去）、`submit` 里做缩放/贴图提交。**不要在 submit 里读实体世界数据**——那是 extract 的职责。
- 模型层：`EntityModel` 子类 + `LayerDefinition`（`ModModelLayerLocations` 存 `ModelLayerLocation`），`ctx.bakeLayer(...)` 取几何。GeoLib/GeckoLib 用户则整段换成库的 GeoRenderer（见 `lib-geckolib`）。

### 客户端注册

在 client-only 类里（FMLClientSetupEvent 或对应客户端事件）：`EntityRenderers.register(ModEntities.PENGUIN.get(), PenguinRenderer::new);`

## 动画：AnimationState 模式

教程套路（两端通用思想）：

```java
// 实体内（公共）：public final AnimationState idleAnimationState = new AnimationState();
// tick() 里仅客户端驱动计时，start(tickCount) 触发；
// 模型的 setupAnim(RenderState) 里根据 state.idleAnimationState 用 ageInTicks 计算骨骼角度
```

动画状态在**实体侧声明、客户端侧驱动、模型侧消费**；26.x 还要经 RenderState 中转。

## 刷怪蛋与自然生成

- 刷怪蛋：注册一个 SpawnEgg 类物品（NeoForge `DeferredSpawnEggItem` / Forge `ForgeSpawnEggItem`，传 entityType supplier），放创造页签即可右键地面刷。
- 自然生成：CREATURE 类走 biome modifier 的 `spawns` 字段（JSON 配 entity + 密度），或 `BiomeModifiers.AddSpawnsBiomeModifier`（datagen）。
- 敌对生物还要 `SpawnPlacements` 注册放置规则（光照/地面判断）。

## 排查清单

- 生成即崩：先查属性事件，再查实体构造器签名。
- 隐形但有碰撞：渲染器没注册或贴图路径 404（看日志 missing texture）。
- 不动不思考：registerGoals 没调 super 场景 / 属性漏 speed。
- 尺寸不对：sized 与模型 LayerDefinition 像素尺寸换算（1 px = 1/16 block）。

## 不清楚时

- 26.X 全家桶分支：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X （77-mob 起：78-variants、79-spawns、85-tameable、90-rideable）
- 1.21.X 对应章：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Tutorial-1.21.X （分支 39-customMob）
- API 细节：`search_neoforge_docs`（关键词 entity）；本仓库规则 `04-entity`
