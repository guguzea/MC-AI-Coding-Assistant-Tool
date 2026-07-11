# GUI / Menu / Screen 开发（Forge 1.18.2）

## 注册 MenuType

```java
public static final DeferredRegister<MenuType<?>> MENUS =
    DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID);
```

## ContainerMenu

```java
public class MyMenu extends AbstractContainerMenu {
    @Override
    public ItemStack quickMoveStack(Player player, int slotIndex) {
        // Shift-click 转移逻辑
        return ItemStack.EMPTY;
    }
}
```

## 常见错误

- ❌ `MenuScreens.register()` 放在服务端
- ❌ `quickMoveStack` 返回空导致物品丢失

## 参考资料

参见 `10-gui.mdc`
