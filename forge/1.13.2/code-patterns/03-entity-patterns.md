# 实体相关模式（Forge 1.13.2）

## 模式: Basic Living Entity

```yaml
模式: Basic Living Entity
版本: Forge 1.13.2
平台: Forge
分类: entity
依赖: []
扩展点: [渲染器, AI]
---
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
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

# 注册
public static final EntityType<MyEntity> MY_ENTITY =
    EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
        .size(0.6f, 1.8f)
        .trackingRange(8)
        .updateInterval(3)
        .build("my_entity");

@SubscribeEvent
public void onEntitiesRegistry(RegistryEvent.Register<EntityType<?>> event) {
    event.getRegistry().register(MY_ENTITY.setRegistryName(
        new ResourceLocation(MOD_ID, "my_entity")
    ));
}
```

## 模式: Entity Renderer

```yaml
模式: Entity Renderer
版本: Forge 1.13.2
平台: Forge
分类: entity
依赖: [Entity]
扩展点: [渲染器]
---
# 渲染器
public class MyEntityRenderer extends RenderLiving<MyEntity> {
    public MyEntityRenderer(EntityRendererManager manager) {
        super(manager, new MyEntityModel(), 0.5f);
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}

# 注册（在客户端初始化中）
RenderingRegistry.registerEntityRenderingHandler(
    MY_ENTITY,
    MyEntityRenderer::new
);
```
