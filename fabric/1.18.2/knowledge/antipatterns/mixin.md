# Mixin 反模式（Fabric 1.18.2）

## 症状

- 游戏启动时报 `Mixin did not apply`
- Mixin 注入后游戏崩溃
- Mixin 中的修改没有生效
- `NoClassDefFoundError` 异常

## 根因分析

### 1. fabric.mixins.json 配置错误

**错误配置：**
```json
// ❌ package 与实际包名不匹配
{
  "package": "com.example.examplemod.mixin",
  "client": ["MyMixin"],  // MyMixin 在 com.example.examplemod.mixin.client 包
  "mixins": []
}
```

**正确配置：**
```json
{
  "package": "com.example.examplemod.mixin",
  "client": ["client.MyMixin"],  // ✅ 包含子包路径
  "mixins": ["common.CommonMixin"]
}
```

### 2. Mixin 在错误的配置块中声明

**错误配置：**
```json
{
  "client": [],
  "mixins": ["client.MyMixin"]  // ❌ 客户端 Mixin 放到了 mixins 中
}
```

**正确配置：**
```json
{
  "client": ["client.MyMixin"],  // ✅ 客户端 Mixin 在 client 中
  "mixins": ["common.CommonMixin"]
}
```

### 3. @Shadow 引用不存在的成员

**错误代码：**
```java
@Mixin(PlayerEntity.class)
public class MixinPlayerEntity {
    @Shadow
    private static Object session;  // ❌ Minecraft 类没有 session 字段
}
```

**正确方案：**
```java
@Mixin(PlayerEntity.class)
public class MixinPlayerEntity {
    @Shadow
    private static MinecraftClient instance;  // ✅ 使用 Yarn 映射中的正确名称
}
```

### 4. @At 位置选项错误

**错误代码：**
```java
@Inject(at = @At(value = "HEAD"),  // ❌ 大小写敏感
    method = "tick")
private void onTick(CallbackInfo ci) {
}
```

**正确方案：**
```java
@Inject(at = @At(value = "HEAD"),  // ✅ 正确的大小写
    method = "tick")
private void onTick(CallbackInfo ci) {
}
```

### 5. Mixin 中创建新实例

**错误代码：**
```java
@Inject(at = @At("HEAD"), method = "tick")
private void onTick(CallbackInfo ci) {
    MyClass obj = new MyClass();  // ❌ 禁止！Mixin 是字节码注入
}
```

### 6. 未运行 `./gradlew clean loom`

**错误：** Mapping 变更或 mixin 配置变更后没有刷新 Loom 缓存。

**正确方案：**
```bash
./gradlew clean loom
# 或
./gradlew clean build
```

### 7. Loom mixin 编译器配置错误

**错误配置：**
```groovy
loom {
    // ❌ 没有正确配置 mixin
}
```

**正确配置：**
```groovy
loom {
    // ✅ Loom 默认支持 mixin，不需要额外配置
    // 只需确保 fabric.mixins.json 在 resources 中
}
```

## Access Widener 与 Mixin 冲突

**问题：** 同时使用 Access Widener 和 Mixin 可能产生冲突。

**解决方案：**
```groovy
loom {
    // accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
}
```

```json
// fabric.mixins.json
{
  "accessWidener": "examplemod.accesswidener"  // ✅ 引用 Access Widener
}
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| Mixin 是否注入 | 添加日志输出测试 |
| 包名是否匹配 | 对比 fabric.mixins.json 的 package 和实际类包名 |
| @At 选项是否正确 | 确认 HEAD/RETURN/TAIL/INVOKE 大小写 |
| 是否需要 clean loom | 变更后执行 `./gradlew clean loom` |
| @Shadow 成员是否存在 | 在 Yarn 映射中查找正确名称 |
