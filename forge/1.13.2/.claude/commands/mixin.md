---
name: mixin
description: Minecraft Forge Mixin 注入（Forge 1.13.2）。@Mixin、@Inject、@At。触发词：Mixin、@Inject、@At、mixins.json
---

# Mixin 注入（Forge 1.13.2）

## 快速开始

### mixins.json

```json
{
  "required": true,
  "minVersion": "0.7.11",
  "package": "com.example.mod.mixin",
  "compatibilityLevel": "JAVA_8",
  "mixins": ["common.SomeMixin"]
}
```

### @Inject

```java
@Mixin(PlayerEntity.class)
public class MixinPlayer {
    @Inject(at = @At("HEAD"), method = "attack(Lnet/minecraft/entity/Entity;)V")
    private void onAttack(CallbackInfo ci) {
        // 注入逻辑
    }
}
```

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin
