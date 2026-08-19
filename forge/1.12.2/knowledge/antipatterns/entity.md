# 实体反模式

## 错误：在 `mcmod.info` 里编 `entities` 字段

**症状：** 误以为实体没注册；官方 gettingstarted/structuring 字段表没有 `entities`

```json
// ❌ 官方 mcmod.info 没有此字段
"entities": { "examplemod:my_entity": "My Entity" }
```

**正确方案：** `RegistryEvent.Register<EntityEntry>` + `EntityEntryBuilder`，不要抄 1.14+ `EntityType.Builder`

---

## 错误：忘记注册渲染器（客户端）

**症状：** 实体显示为缺失模型（紫色黑色）

```java
// ❌ ClientProxy 中忘记注册
public class ClientProxy extends CommonProxy {
    // 没有 registerRenderers()
}

// ✅ 正确
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

---

## 错误：在构造函数中访问 world

**症状：** NPE 或 world 相关数据错误

```java
// ❌ 错误
public MyEntity(World world) {
    super(world);
    World w = this.getEntityWorld(); // 可能为 null
}

// ✅ 正确：在 update() 或其他方法中访问
public MyEntity(World world) {
    super(world);
}
```
