---
name: mc-entity
description: Minecraft Forge 实体开发（Forge 1.13.2）。创建生物、实体属性。
---

# 实体开发（Forge 1.13.2）

## 快速开始

```java
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
    }
}
```

## 参考资料

- 详细示例：参见 `04-entity.mdc`
