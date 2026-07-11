---
name: mc-mixin
description: Minecraft Forge Mixin 注入。
platform: forge
version: "1.18.2"
---

# Mixin 注入（Forge 1.18.2）

## @Inject 用法

```java
@Mixin(Player.class)
public class MixinPlayer {
    @Inject(at = @At("HEAD"), method = "attack(L...;)V")
    private void onAttack(LivingEntity target, CallbackInfo ci) {
        // ...
    }
}
```

## 参考资料

参见 `05-events.mdc`
