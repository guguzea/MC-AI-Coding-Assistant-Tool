# Mixin 注入（Forge 1.18.2）

## mixins.json

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_17",
  "mixins": ["common.SomeMixin"]
}
```

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

## 常见错误

- ❌ 在 Mixin 中 `new` 实例
- ❌ mixin 类不在 `mixins.json` 中声明

## 参考资料

参见 `05-events.mdc`
