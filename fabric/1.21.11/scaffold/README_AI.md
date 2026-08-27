# Example Mod - Fabric 1.21.11

本模板项目展示了一个完整的 Fabric 1.21.11 模组结构。

## 版本要求

- **Minecraft**: 1.21.11
- **Java**: 21
- **Fabric Loader**: 0.19.3
- **Fabric API**: 0.141.6+1.21.11
- **Loom**: 1.17-SNAPSHOT（`net.fabricmc.fabric-loom-remap`）
- **Gradle**: 9.5.1
- 来源：FabricMC/fabric-example-mod @ `8cd77ea`

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
        new CustomPayload.Id<>(Identifier.of("modid", "my_packet"));
}
```

### Attachment API

1.21.x 使用 Attachment API 替代旧的 Capability：

```java
import net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry;
import net.fabricmc.fabric.api.attachment.v1.AttachmentType;
import net.minecraft.util.Identifier;

public static final AttachmentType<Integer> CLICKS =
    AttachmentRegistry.create(Identifier.of("modid", "clicks"));

entity.setAttached(CLICKS, 1);
Integer n = entity.getAttached(CLICKS);
```

## 许可证

MIT
