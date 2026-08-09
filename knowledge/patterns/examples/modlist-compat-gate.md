# ModList 门闩 + 兼容类（示范）

平台：Forge 1.20.1 · 依赖：`authored/soft-deps-modlist`、`authored/library-integration`

```java
// ExampleMod 或 ModEvents — 不 import 第三方 API
private void commonSetup(FMLCommonSetupEvent event) {
    event.enqueueWork(() -> {
        if (ModList.get().isLoaded("curios")) {
            CuriosCompat.registerSlots();
        }
    });
}
```

```java
// compat/CuriosCompat.java — 此类才 import top.theillusivec4.curios…
public final class CuriosCompat {
    public static void registerSlots() { /* API 调用 */ }
    private CuriosCompat() {}
}
```

要点：`isLoaded` 的字符串是对方 **modId**；兼容类不要被主类静态字段引用。

常见坑：未装库时主类已加载 `CuriosCompat` → `NoClassDefFoundError`；Mixin 目标类仅在对方存在时启用 → 拆分 mixin 配置或条件。
