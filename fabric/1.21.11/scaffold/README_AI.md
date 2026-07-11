# Example Mod - Fabric 1.21.11

本模板项目展示了一个完整的 Fabric 1.21.11 模组结构。

## 版本要求

- **Minecraft**: 1.21.11
- **Java**: 21
- **Fabric Loader**: 0.16.x
- **Fabric API**: 0.200.x

## 项目结构

```
src/main/
├── java/com/example/examplemod/
│   ├── ExampleMod.java         # 服务端入口
│   ├── ExampleModClient.java   # 客户端入口
│   ├── ExampleAnimalEntity.java # 自定义实体
│   └── mixin/
│       ├── ExampleMixin.java       # 服务端 Mixin
│       └── client/ExampleMixin.java # 客户端 Mixin
└── resources/
    ├── fabric.mod.json         # 模组元数据
    ├── examplemod.mixins.json  # Mixin 配置
    └── pack.mcmeta             # 资源包配置
```

## 构建命令

```bash
./gradlew build        # 构建模组
./gradlew runClient    # 运行客户端
./gradlew runServer    # 运行服务端
./gradlew loom        # 刷新 Loom
```

## 关键 API 变化 (1.21.x)

### 网络通信

1.21.x 使用 `PayloadTypeRegistry` 和 `CustomPayload` 接口：

```java
public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID = 
        new CustomPayload.Id<>(new Identifier("modid", "my_packet"));
}
```

### Attachment API

1.21.x 使用 Attachment API 替代旧的 Capability：

```java
public static final Key<MyData> MY_DATA = Key.create(
    Registries.ATTACHMENT_TYPE, 
    new Identifier("modid", "my_data")
);
```

## 许可证

MIT
