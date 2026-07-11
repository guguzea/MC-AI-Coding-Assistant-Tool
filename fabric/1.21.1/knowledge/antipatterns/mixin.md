# Mixin 相关反模式

## ❌ 忘记在 fabric.mixins.json 中声明

**症状**：Mixin 不生效，注入失败

**原因**：Mixin 类已创建但未在配置文件中声明

```json
// ❌ 错误
{
  "package": "com.example.examplemod.mixin",
  "mixins": []  // MyMixin 未声明
}

// ✅ 正确
{
  "package": "com.example.examplemod.mixin",
  "mixins": ["MyMixin"]  // 声明
}
```

## ❌ 包名不匹配

**症状**：Mixin 注入失败或错误注入

**原因**：Mixin 类的包名与 `fabric.mixins.json` 中的 `package` 不一致

```java
// fabric.mixins.json
{
  "package": "com.example.examplemod.mixin"  // 声明的包
}

// ❌ 错误：实际类在不同的包
package com.example.examplemod.other;
public class MyMixin { ... }

// ✅ 正确：包名一致
package com.example.examplemod.mixin;
public class MyMixin { ... }
```

## ❌ 客户端 Mixin 放入 mixins 列表

**症状**：服务端启动崩溃，引用了不存在的类

**原因**：`fabric.mixins.json` 中的 `mixins` 是服务端 Mixin，`client` 是客户端 Mixin

```json
// ❌ 错误
{
  "mixins": ["MyClientMixin"],  // MyClientMixin 引用了 WorldRenderer
  "client": []
}

// ✅ 正确
{
  "mixins": ["MyServerMixin"],
  "client": ["MyClientMixin"]  // 正确分离
}
```

## ❌ 在 Mixin 中创建新实例

**症状**：编译错误或运行时异常

**原因**：Mixin 是在运行时字节码注入，禁止 `new` 创建实例

```java
// ❌ 错误
@Inject(at = @At("HEAD"), method = "tick")
private void onTick(CallbackInfo ci) {
    MyClass obj = new MyClass();  // 禁止！
}

// ✅ 正确：Mixin 仅修改现有对象状态
@Inject(at = @At("HEAD"), method = "tick")
private void onTick(CallbackInfo ci) {
    this.someField = newValue;  // 修改现有字段
}
```

## ❌ @Shadow 引用错误的成员

**症状**：Mixin 注入失败

**原因**：@Shadow 的目标成员不存在或名称错误

```java
// ❌ 错误：Minecraft 类没有 session 字段
@Shadow private static Object session;

// ✅ 正确：使用正确的 Yarn 名称
@Shadow private static MinecraftClient instance;
```

## ❌ 混淆 @Inject 和 @Redirect

**症状**：方法行为异常

**原因**：不了解两个注解的区别

- `@Inject` — 在指定位置插入代码
- `@Redirect` — 将指定方法调用重定向到另一个方法

```java
// ✅ @Inject：添加额外逻辑
@Inject(at = @At("HEAD"), method = "tick")
private void onTick(CallbackInfo ci) {
    // 在 tick 方法开头添加逻辑
}

// ✅ @Redirect：替换方法调用
@Redirect(method = "tick", at = @At(value = "INVOKE",
    target = "Lnet/minecraft/client/MinecraftClient;tick()V"))
private void onMinecraftTick(MinecraftClient client) {
    // 替换原有的 tick() 调用
}
```

## ❌ 忘记运行 clean loom

**症状**：Mixin 变更不生效

**原因**：Loom 缓存了旧的字节码

```bash
# ❌ 错误
./gradlew build  # 可能不生效

# ✅ 正确
./gradlew clean loom
```
