# 实体代码模式（Forge 1.14.4）

## 基础生物实体

```java
// 注册
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    new DeferredRegister<>(ForgeRegistries.ENTITIES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
        .size(0.6f, 1.8f)
        .setTrackingRange(8)
        .setUpdateInterval(3)
        .immuneToFire()
        .build("my_entity")
);

// 实体类
public class MyEntity extends LivingEntity {
    private static final EntityDataManager<Integer> DATA_HEALTH =
        EntityDataManager.createKey(MyEntity.class, DataSerializers.VARINT);

    protected MyEntity(EntityType<?> type, World world) {
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

    @Override
    protected void registerData() {
        super.registerData();
        this.dataManager.register(DATA_HEALTH, this.getMaxHealth());
    }
}
```

## 投掷物实体（Projectile）

```java
public class MyProjectile extends Projectile {
    public static final RegistryObject<EntityType<MyProjectile>> TYPE = /* 注册 */;

    public MyProjectile(EntityType<?> type, World world) {
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

    @Override
    protected void registerData() {
        super.registerData();
    }
}
```

## 实体渲染器

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        RenderingRegistry.registerEntityRenderingHandler(
            ModEntities.MY_ENTITY.get(),
            MyEntityRenderer::new
        );
    }
}

public class MyEntityRenderer extends LivingRenderer<MyEntity, MyEntityModel<MyEntity>> {
    public MyEntityRenderer(EntityRendererManager renderManager) {
        super(renderManager, new MyEntityModel<>(), 0.5f);
        this.addLayer(new HeldItemLayer<>(this, this.getRenderManager().getItemRenderer()));
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

## 实体属性注册

本档没有 `ForgeRegistries.ATTRIBUTES`。在实体里重写 `registerAttributes()`，用 `SharedMonsterAttributes` 设基值。
