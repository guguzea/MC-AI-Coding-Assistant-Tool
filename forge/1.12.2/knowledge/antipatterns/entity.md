# 实体反模式

## 错误：忘记在 mcmod.info 中添加 entity 字段

**症状：** 实体不在游戏中生成，但无任何异常

```json
// ❌ 遗漏
// mcmod.info 中没有 entities 字段

// ✅ 正确
{
  "modid": "examplemod",
  "entities": {
    "examplemod:my_entity": "My Entity"
  }
}
```

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
