# 实体代码模式（Forge 1.15.2）

## 基础生物实体

```java
// 注册
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
        .size(0.6f, 1.8f)
        .clientTrackingRange(8)
        .updateInterval(3)
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

```java
public class MyProjectile extends Projectile {
    public static EntityType<MyProjectile> TYPE;

    public MyProjectile(EntityType<? extends MyProjectile> type, World world) {
        super(type, world);
    }

    @Override
    protected void onImpact(RayTraceResult result) {
        super.onImpact(result);
        if (!this.world.isRemote) {
            this.world.createExplosion(null, this.getPosX(), this.getPosY(), this.getPosZ(),
                2.0f, false, Explosion.Mode.BREAK);
            this.remove();
        }
    }
}
```

## 实体渲染器

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
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
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID);

public static final RegistryObject<Attribute> EXTRA_HEALTH = ATTRIBUTES.register("extra_health",
    () -> new RangedAttribute("attribute.modid.extra_health", 0.0, 0.0, 1000.0).setSyncable(true)
);

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);

// 实体中应用
this.getAttribute(ATTRIBUTES.get("extra_health")).ifPresent(attr ->
    this.getAttributeMap().registerAttribute(attr)
);
```
