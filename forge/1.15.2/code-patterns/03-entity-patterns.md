# 实体代码模式（Forge 1.15.2）

## 基础生物实体

```java
// 注册
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, EntityClassification.CREATURE)
        .sized(0.6f, 1.8f)
        .setTrackingRange(8)
        .setUpdateInterval(3)
    .build("my_entity")
);

// 实体类
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<? extends MyEntity> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        this.goalSelector.addGoal(0, new SwimGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomWalkingGoal(this, 1.0));
        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
        this.getAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0);
        this.getAttribute(SharedMonsterAttributes.FOLLOW_RANGE).setBaseValue(32.0);
    }
}
```

## 投掷物实体（Projectile）

official 构件实证（javap @`forge-1.15.2-31.2.50_mapped_official_1.15.2.jar`，2026-10-05）：152 official 构件**没有**
`Projectile` / `ProjectileEntity` 通用投掷物基类（`ProjectileEntity` 是 1.16+ 类名）；generic 形态走 `ThrowableEntity`，
命中回调 = `onHit(RayTraceResult)`（❌ `onImpact` = MCP 层名）。❌ `this.world` / `getPosX` / `createExplosion` 同理，
official = `this.level` / `position()` / `World#explode(...)`。

```java
public class MyProjectile extends ThrowableEntity {
    public static EntityType<MyProjectile> TYPE;

    public MyProjectile(EntityType<? extends MyProjectile> type, World world) {
        super(type, world);
    }

    @Override
    protected void onHit(RayTraceResult result) {
        if (!this.level.isClientSide) {
            this.level.explode(null, this.position().x, this.position().y, this.position().z,
                2.0f, false, Explosion.Mode.BREAK);
            this.remove();
        }
    }
}
```

## 实体渲染器

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        RenderingRegistry.registerEntityRenderingHandler(MyEntity.TYPE, MyEntityRenderer::new);
    }
}

public class MyEntityRenderer extends Render<MyEntity> {
    private final Model<MyEntity> model = new MyEntityModel<>();

    public MyEntityRenderer(EntityRendererManager renderManager) {
        super(renderManager);
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }

    @Override
    protected void render(MyEntity entity, float entityYaw, float partialTicks,
                         MatrixStack matrixStack, IRenderTypeBuffer buffer, int packedLight) {
        super.render(entity, entityYaw, partialTicks, matrixStack, buffer, packedLight);
    }
}
```

## 实体属性注册

```java
// 本档**没有** `ForgeRegistries.ATTRIBUTES`（1.16+ 才有）—— 见 `04-entity.mdc:29-30`、`09-anti-patterns.mdc:22-28`
// TODO(未核实)：1.15.2 是否真的没有该常量、注册表引入版本，仓内无一手语料（仅 1.16.5+ 各档示例出现
// `ForgeRegistries.ATTRIBUTES`）；取证前不要把本断言当已核实事实（见根 AGENTS.md 证据纪律）。
// 属性基值在实体类里重写 registerAttributes() 设置（同文件 :33-40 已有完整形态）：
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
    this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
}
```
