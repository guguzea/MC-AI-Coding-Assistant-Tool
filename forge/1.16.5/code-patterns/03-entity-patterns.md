# 实体代码模式（Forge 1.16.5）

## 基础生物实体

```java
// 注册
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, EntityClassification.CREATURE)
        .sized(0.6f, 1.8f)
        .clientTrackingRange(8)
        .updateInterval(3)
    .build("my_entity")
);

// 实体类
public class MyEntity extends CreatureEntity {
    private static final DataParameter<Integer> DATA_HEALTH =
        EntityDataManager.defineId(MyEntity.class, DataSerializers.VARINT); // ❌ createKey = MCP 层名（official: defineId，2026-10-05 构件实证）

    protected MyEntity(EntityType<? extends MyEntity> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        this.goalSelector.addGoal(0, new FloatGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.addGoal(2, new WaterAvoidingRandomStrollGoal(this, 1.0));
        this.targetSelector.addGoal(0, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }

    public static AttributeModifierMap.MutableAttribute createAttributes() {
        return MobEntity.createMobAttributes()
            .add(Attributes.MAX_HEALTH, 20.0D)
            .add(Attributes.MOVEMENT_SPEED, 0.3D)
            .add(Attributes.ATTACK_DAMAGE, 3.0D);
    }

    @Override
    protected void defineSynchedData() { // ❌ registerData = MCP 层名（official: Entity#defineSynchedData，2026-10-05 构件实证）
        super.defineSynchedData();
        this.entityData.register(DATA_HEALTH, this.getMaxHealth());
    }
}
```

## 投掷物实体（Projectile）

```java
public class MyProjectile extends ProjectileEntity {
    public static final EntityType<MyProjectile> TYPE = /* 注册 */;

    public MyProjectile(EntityType<? extends MyProjectile> type, World world) {
        super(type, world);
    }

    @Override
    protected void onHit(RayTraceResult result) { // ❌ onImpact = MCP 层名（official: ProjectileEntity#onHit，abstract，无 super 可调）
        if (!this.level.isClientSide) {
            // official 构件实证（javap @1.16.5 official，2026-10-05）：World#globalLevelEvent(int, BlockPos, int) /
            // Entity#blockPosition() / Block.getId(BlockState) / defaultBlockState()；❌ playEvent/getPosition/getStateId/getDefaultState/world 均为 MCP 名
            this.level.globalLevelEvent(2001, this.blockPosition(), Block.getId(Blocks.AIR.defaultBlockState()));
            this.remove();
        }
    }
}
```

## 实体渲染器（Biped）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        RenderingRegistry.registerEntityRenderingHandler(MY_ENTITY.get(), MyEntityRenderer::new);
    }
}

public class MyEntityRenderer extends LivingEntityRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererManager manager) {
        super(manager, new MyEntityModel<>(), 0.5f);
        this.addLayer(new HumanoidArmorLayer<>(this,
            new MyEntityModel<>(0.5f),
            new MyEntityModel<>(1.0f)));
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

## 实体属性注册

```java
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID);

public static final RegistryObject<Attribute> EXTRA_HEALTH = ATTRIBUTES.register("extra_health",
    () -> (new RangedAttribute("attribute.modid.extra_health", 0.0, 0.0, 1000.0)).setShouldWatch(true)
);

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);

// 实体中应用
this.getAttribute(EXTRA_HEALTH.get()).ifPresent(attr ->
    this.getAttributeManager().registerAttribute(attr)
);
```
