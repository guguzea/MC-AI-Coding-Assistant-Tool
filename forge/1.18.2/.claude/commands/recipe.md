# 配方相关（Forge 1.18.2）

## 注册 RecipeType

```java
public static final RecipeType<MyRecipe> MILLING =
    RecipeType.register(MOD_ID + ":milling");
```

## 实现 Recipe

```java
public class MyRecipe implements Recipe<Container> {
    @Override
    public boolean matches(Container container, Level level) {
        return input.test(container.getItem(0));
    }

    @Override
    public ItemStack assemble(Container container, RegistryAccess access) {
        return output.copy();  // 必须返回副本！
    }
}
```

## 常见错误

- ❌ `RecipeType` 写在 DeferredRegister 中
- ❌ `assemble` / `getResultItem` 返回原对象而非副本

## 参考资料

参见 `03-item.mdc`
