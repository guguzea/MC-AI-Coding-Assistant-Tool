# 实体代码模式

适用版本：Fabric 1.21.1

## 基本实体注册

```java
// 注册实体类型
public static final RegistrySupplier<EntityType<MyEntity>> MY_ENTITY = Registry.register(
    Registries.ENTITY_TYPE,
    new Identifier(MOD_ID, "my_entity"),
    EntityType.Builder.create(
        MyEntity::new,
        MobCategory.CREATURE
    )
    .dimensions(EntityDimensions.changing(0.75f, 0.75f))  // 宽, 高
    .maxTrackOffset(10)
    .trackRangeBlocks(10)
    .build()
);

// 注册属性
EntityAttributeSupplementRegistry.register(MY_ENTITY.get(), entity ->
    MobEntity.createMobAttributes()
        .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
        .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
        .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 3.0)
);

// 注册生成限制
SpawnRestrictionRegistration.mobSpawn().register(
    MY_ENTITY.get(),
    SpawnRestriction.Location.ON_GROUND,
    Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
    MyEntity::canSpawn
);
```

## 实体类

```java
public class MyEntity extends MobEntity {
    public MyEntity(EntityType<? extends MyEntity> type, World world) {
        super(type, world);
    }

    @Override
    protected void initGoals() {
        // 设置 AI 目标
        this.goalSelector.add(0, new SwimGoal(this));
        this.goalSelector.add(1, new WanderAroundFarGoal(this, 1.0));
        this.goalSelector.add(2, new LookAroundGoal(this));
        this.goalSelector.add(3, new FollowParentGoal(this, 1.1));

        this.targetSelector.add(0, new ActiveTargetGoal<>(
            this, PlayerEntity.class, true
        ));
    }

    @Override
    public boolean canSpawn(WorldAccess world, SpawnReason spawnReason) {
        // 自定义生成条件
        return super.canSpawn(world, spawnReason);
    }
}
```

## 实体渲染器

```java
// 在 ClientModInitializer 中注册
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.register(ExampleMod.MY_ENTITY.get(), (context) ->
            new AnimalEntityRenderer<>(
                context.getModelLoader().getModelPart(EntityModelLayers.COW),
                new CowEntityModel(),
                0.5f
            )
        );
    }
}
```

## 可繁殖实体

```java
public class MyAnimalEntity extends AnimalEntity {
    private int loveTimer = 0;

    @Override
    public boolean isBreedingItem(ItemStack stack) {
        return stack.isOf(Items.WHEAT);  // 繁殖物品
    }

    @Override
    public void tick() {
        super.tick();
        if (loveTimer > 0) loveTimer--;
    }

    @Override
    public boolean canBreed() {
        return loveTimer <= 0;
    }

    @Override
    @Nullable
    public MyAnimalEntity createChild(ServerWorld world, @Nullable PassiveEntity other) {
        return ExampleMod.MY_ANIMAL.get().create(world, SpawnReason.BREEDING);
    }
}
```

## 骑乘实体

```java
public class MyRidableEntity extends MobEntity {
    @Override
    public ActionResult interactMob(PlayerEntity player, Hand hand) {
        if (!this.world.isClient && !player.shouldCancelInteraction()) {
            player.startRiding(this);
            return ActionResult.SUCCESS;
        }
        return super.interactMob(player, hand);
    }

    @Override
    public void tick() {
        super.tick();
        // 自定义骑乘逻辑
    }
}
```

## 自定义属性

```java
// 注册属性
EntityAttributeSupplementRegistry.register(MY_ENTITY.get(), entity ->
    MobEntity.createMobAttributes()
        .add(EntityAttributes.GENERIC_FOLLOW_RANGE, 32.0)
        .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
        .add(EntityAttributes.GENERIC_MAX_HEALTH, 30.0)
        .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 5.0)
        .add(EntityAttributes.GENERIC_ARMOR, 2.0)
        .add(EntityAttributes.GENERIC_LUCK, 0.0)
);

// 额外属性（使用 Fabric API）
EntityAttributeSupplementRegistry.register(MY_ENTITY.get(), entity ->
    EntityAttributeModifiers.createVariable(
        EntityAttributes.GENERIC_MOVEMENT_SPEED,
        0.1,
        EntityAttributeModifier.Operation.MULTIPLY_TOTAL
    )
);
```

## 实体死亡掉落

```java
// 使用 Mixin 或事件监听
EntityEvents.ENTITY_DEATH.register((entity, source) -> {
    if (entity.getType() == MY_ENTITY.get() && !entity.world.isClient) {
        // 在实体死亡位置掉落物品
        ItemEntity item = new ItemEntity(
            entity.world,
            entity.getX(), entity.getY(), entity.getZ(),
            new ItemStack(Items.DIAMOND, 1)
        );
        entity.world.spawnEntity(item);
    }
});
```
