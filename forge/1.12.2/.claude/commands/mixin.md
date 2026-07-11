# Mixin 注入（Forge 1.12.2）

## 快速开始

### 1. 配置 mixins.json

文件：`src/main/resources/mixins.{modid}.json`

```json
{
  "required": true,
  "minVersion": "0.7.11",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_8",
  "mixins": ["MixinExample"],
  "client": ["MixinClientExample"]
}
```

### 2. @Inject 用法

```java
@Mixin(Entity.class)
public class MixinEntity {
    @Inject(
        at = @At(value = "HEAD"),
        method = "attack(Lnet/minecraft/entity/Entity;)V"
    )
    private void onAttack(CallbackInfo ci) {
        System.out.println("Entity attacks!");
    }
}
```

### 3. @At 位置选项

| `value` | 含义 |
|----------|------|
| HEAD | 方法第一条指令 |
| RETURN | 方法 return 之前 |
| TAIL | 方法最后一条指令 |

## 常见错误

- ❌ Mixin 注入到构造函数
- ❌ 错误的 `@At` 参数
- ❌ mixin 类不在 `mixins.json` 中声明

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin
