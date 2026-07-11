# Fabric Mixin 开发命令参考

本文件描述 Fabric 1.21.11 平台上进行 Mixin（字节码注入）开发时所需掌握的核心 API 和常用命令。

## 基础配置命令

### fabric.mixins.json 创建命令

Mixin 配置文件位于 `src/main/resources/` 目录，文件名必须与 `fabric.mod.json` 的 `mixins` 字段中声明的名称一致。基本配置命令：

```json
{
  "required": true,
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_17",
  "client": ["client.ClientMixin"],
  "server": [],
  "mixins": ["common.CommonMixin", "common.AnotherMixin"]
}
```

`required` 设置为 `true` 表示如果 mixin 注入失败则游戏终止。`package` 指定 mixin 类的包名前缀。`compatibilityLevel` 必须匹配项目使用的 Java 版本。`client` 数组包含仅在客户端注入的 mixin 类名（相对于 `package`），`mixins` 数组包含在服务端和客户端都注入的 mixin。

### Loom mixin 配置命令

在 `build.gradle` 中需要确保 Loom 插件正确配置。Loom 原生支持 Mixin，不需要额外的插件配置。如果需要访问非公共成员，可以在 `loom { }` 块中添加 `accessWidenerPath = file("src/main/resources/examplemod.accesswidener")`。Access Widener 文件语法：`accessWidener v2 named` 开头，每行一个规则：`accessifier class_or_member_type net/minecraft/package/ClassName fieldName` 或 `accessifier class net/minecraft/package/ClassName`。

### @Mixin 注解命令

Mixin 类使用 `@Mixin` 注解标记目标类。基本命令：`@Mixin(TargetClass.class)`。Mixin 类应该是抽象的，不需要构造函数。`TargetClass` 可以是任何 Minecraft 类，使用 Yarn 映射的命名（如 `MinecraftClient`、`WorldRenderer`）。`value` 参数可以指定更精确的目标：`@Mixin(value = TargetClass.class, client = true)` 仅在客户端注入。

### @At 注入点命令

`@At` 注解指定注入的目标位置。常用值包括：`@At("HEAD")` 在方法开头注入，`@At("RETURN")` 在方法返回前注入，`@At("TAIL")` 在方法末尾注入，`@At("INVOKE")` 在指定方法调用处注入，`@At("NEW")` 在 `new` 表达式处注入。`@At("INVOKE")` 需要配合 `shift` 参数：`shift = At.Shift.AFTER` 或 `shift = At.Shift.BEFORE`。

### @Inject 注入命令

`@Inject` 注解定义注入的方法。基本命令：`@Inject(at = @At("HEAD"), method = "targetMethod")`。`method` 参数指定要注入的目标方法名（使用 Yarn 映射名）。`at` 参数指定注入点。`locals` 参数声明要捕获的局部变量：`@Inject(method = "tick", at = @At("TAIL"), locals = LocalCapture.CAPTURE_FAILHARD)`。`cancellable` 参数设置为 `true` 使注入方法可以取消事件。

### @Shadow 阴影命令

`@Shadow` 注解用于引用目标类中已存在的字段或方法，而不需要重新声明。基本命令：`@Shadow private World world;` 或 `@Shadow(method = "methodName") private void shadowedMethod() {}`。被 shadow 的成员不能被调用它们的代码直接访问，但可以在 mixin 内部使用。字段类型和方法签名必须与目标类完全一致。

### @Overwrite 重写命令

`@Overwrite` 注解用于完全替换目标方法。谨慎使用，因为可能破坏游戏的内部状态。基本命令：`@Overwrite public void targetMethod() { // 新实现 }`。使用前必须完全理解目标方法的实现和所有副作用。

## CallbackInfo 命令

### CallbackInfo 参数命令

注入方法必须接受 `CallbackInfo`（或 `CallbackInfoReturnable<T>`）作为最后一个参数。基本命令：`private void myMethod(Args..., CallbackInfo ci) { ci.cancel(); }`。`CallbackInfo` 提供了 `cancel()` 方法用于取消后续代码执行，`isCancelled()` 检查是否已取消。

### CallbackInfoReturnable 返回值命令

如果目标方法有返回值，使用 `CallbackInfoReturnable<T>` 替代 `CallbackInfo`。基本命令：`private void myMethod(Args..., CallbackInfoReturnable<T> cir) { cir.setReturnValue(customValue); cir.cancel(); }`。`setReturnValue()` 设置返回值，`cancel()` 阻止原始代码执行。

## 常见 Mixin 模式命令

### 修改字段值命令

使用 `@Inject` 和 `@At("FIELD")` 修改字段值，或在方法中通过 shadowed 字段访问并修改：

```java
@Shadow private int fieldToModify;

@Inject(method = "someMethod", at = @At("HEAD"))
private void modifyField(CallbackInfo ci) {
    this.fieldToModify = 42;
}
```

### 修改方法参数命令

在 `locals` 中捕获参数后可以修改：

```java
@Inject(method = "takeDamage", at = @At("HEAD"), locals = LocalCapture.CAPTURE_FAILHARD)
private void modifyDamage(float amount, CallbackInfoReturnable<Integer> cir) {
    // amount 是局部变量，可以在这里修改后再使用
}
```

### 插入新逻辑命令

在目标方法的特定位置插入新逻辑：

```java
@Inject(method = "tick", at = @At(value = "INVOKE", target = "Lnet/minecraft/world/World;getTime()J"))
private void onWorldTick(CallbackInfo ci) {
    // 在 World.getTime() 调用之后执行
}
```

## 调试命令

### Mixin 调试配置命令

在 `src/main/resources/` 目录创建 `mixin.refmap.json` 的同目录配置文件可以启用调试。在 gradle.properties 中添加 `org.spongepowered.mixin.debug=true` 启用详细日志。使用 `./gradlew clean loom` 重新生成 mixin 映射。Loom 会自动生成 sourcemap，在 IDE 中可以设置断点调试 mixin 代码。

### Mixin 验证命令

如果 mixin 没有正确应用，检查控制台输出中的 `[Mixin] ` 前缀日志。常见错误包括：包名不匹配（`fabric.mixins.json` 中的 `package` 与实际包名不一致）、类名拼写错误、目标方法不存在（检查 Yarn 映射名是否正确）。使用 `MixinBootstrap.init()` 可以在早期阶段初始化 mixin 系统并显示更详细的错误信息。

## 高级命令

### Accessor Mixin 命令

创建访问器接口用于访问私有成员：`@Mixin(TargetClass.class) public interface TargetClassAccessor { @Accessor("privateField") static int getPrivateField(); }`。使用 `@Accessor` 注解自动生成 getter/setter。方法名必须与目标字段名匹配。

### Invoker Mixin 命令

创建调用器用于调用私有方法：`@Mixin(TargetClass.class) public interface TargetClassInvoker { @Invoker("privateMethod") private void invokePrivateMethod(); }`。使用 `@Invoker` 注解自动生成调用方法。方法签名必须与目标方法完全一致。

### Mixin 优先级命令

Mixin 应用顺序默认按照配置文件中的声明顺序。使用 `priority` 参数调整：`@Mixin(value = TargetClass.class, priority = 1000)`。数值越低越先应用（更接近目标代码）。高优先级 mixin 的修改会被低优先级的覆盖。
