---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 目标、实体渲染器。触发词：实体、Entity、EntityLiving、EntityEntry、RenderingRegistry
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 实体开发（Forge 1.12.2）

## 快速开始

```java
// 实体类
public class MyEntity extends EntityLiving {
    public MyEntity(World world) {
        super(world);
        this.setSize(0.6f, 1.8f);
    }

    @Override
    protected void applyEntityAttributes() {
        super.applyEntityAttributes();
        this.getEntityAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0D);
        this.getEntityAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3D);
        this.getEntityAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0D);
    }
}

// 注册（参见 mc-registry Skill）
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModEntities {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<EntityEntry> event) {
        EntityRegistry.registerGlobalEntityType(
            EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
                .setName("My Entity")
                .setRegistryName(MOD_ID, "my_entity")
                .setTrackingRange(64)
                .setShouldDespawn(true)
                .size(0.6f, 1.8f)
                .build(MOD_ID + ":my_entity"),
            MOD_ID
        );
    }
}
```

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 基础生物（动物/怪物） | `EntityLiving` |
| 投掷物（雪球、末影珍珠） | `EntityThrowable` |
| 物品实体 | `EntityItem` |
| 存储实体 | `TileEntity`（或 `Entity`) |

## 渲染器注册（客户端）

```java
@SideOnly(Side.CLIENT)
public class ClientProxy extends CommonProxy {
    @Override
    public void registerRenderers() {
        RenderingRegistry.registerEntityRenderingHandler(
            MyEntity.class,
            new RenderMyEntity.Factory()
        );
    }
}

public class RenderMyEntity extends RenderLiving<MyEntity> {
    public RenderMyEntity(RenderManager manager) {
        super(manager, new ModelBiped(), 0.5f);
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }

    public static class Factory implements IRenderFactory<MyEntity> {
        @Override
        public Render<? super MyEntity> createRenderFor(RenderManager manager) {
            return new RenderMyEntity(manager);
        }
    }
}
```

## 常见错误

- ❌ 忘记在 mcmod.info 中添加 entity 字段
- ❌ 忘记注册渲染器
- ❌ `applyEntityAttributes()` 不调用 `super`

## 参考资料

- 详细示例：参见 `04-entity.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 实体类型通过 RegistryEvent 注册 |
| `mc-capability` | 实体可附加 Capability |
