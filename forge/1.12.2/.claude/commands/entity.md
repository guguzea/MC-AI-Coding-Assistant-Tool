# 实体开发（Forge 1.12.2）

## 快速开始

```java
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
    }
}

@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModEntities {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<EntityEntry> event) {
        EntityRegistry.registerGlobalEntityType(
            EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)
                .setName("My Entity")
                .setRegistryName(MOD_ID, "my_entity")
                .setTrackingRange(64)
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
| 投掷物 | `EntityThrowable` |
| 物品实体 | `EntityItem` |

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
```

## 常见错误

- ❌ 忘记在 mcmod.info 中添加 entity 字段
- ❌ 忘记注册渲染器

## 参考资料

- 详细示例：参见 `04-entity.mdc`
