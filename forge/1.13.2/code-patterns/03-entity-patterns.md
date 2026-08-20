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
public class MyEntity extends EntityCreature {
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
    protected void initEntityAI() {
        this.tasks.addTask(0, new EntityAISwimming(this));
        this.tasks.addTask(1, new EntityAIAttackMelee(this, 1.0, true));
        this.tasks.addTask(2, new EntityAIWanderAvoidWater(this, 1.0));
        this.tasks.addTask(3, new EntityAIWatchClosest(this, EntityPlayer.class, 8.0f));
        this.tasks.addTask(4, new EntityAILookIdle(this));

        this.targetTasks.addTask(0, new EntityAINearestAttackableTarget<>(this, EntityPlayer.class, true));
    }
}

# 注册
public static final EntityType<MyEntity> MY_ENTITY =
    EntityType.Builder.create(MyEntity.class, MyEntity::new)
        .tracker(8, 3, true)
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
