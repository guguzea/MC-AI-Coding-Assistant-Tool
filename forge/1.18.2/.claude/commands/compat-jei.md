# JEI/EMI 兼容（Forge 1.18.2）

## 最佳方案：JEI/EMI 自动读取

只要配方通过 `RecipeProvider` 生成到 `src/generated/resources/data/{modid}/recipes/`，JEI 和 EMI 都会自动发现并显示，**无需任何 JEI/EMI 代码**。

## 常见错误

- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI/EMI
- ❌ DataGen 运行后未刷新 IDE 资源

## 参考资料

参见 `knowledge/` 目录
