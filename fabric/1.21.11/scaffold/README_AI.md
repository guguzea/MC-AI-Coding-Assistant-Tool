# Example Mod - Fabric 1.21.11

本模板项目展示了一个完整的 Fabric 1.21.11 模组结构。

## 版本要求

- **Minecraft**: 1.21.11
- **Java**: 21
- **Fabric Loader**: 0.19.5（maven 最新；与 Fabric API 是两个制品。2026-09-29 由 0.19.3 修正：Fabric Language Kotlin 现行构建要求 `fabricloader >=0.19.5`，钉 0.19.3 时 runClient 直接 `Incompatible mods found!`）
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
./gradlew genSources        # 刷新映射后的源码
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

CC0-1.0 —— 与本档 `scaffold/gradle.properties:21` 的 `mod_license=CC0-1.0` 同值（该键经 `scaffold/build.gradle:38` 展开进 `src/main/resources/fabric.mod.json:11` 的 `license`）。此钉值随上游模板 FabricMC/fabric-example-mod @ `8cd77ea`（见本文件 :13 血统注）一并钉入；旧写法 MIT 与钉住的元数据不符。仓库自身的 LICENSE 另计，见销账台账「需要用户裁定」。

## 兼容声明（钉值）

- 本目录 `gradle.properties` / `build.gradle` 里的版本钉值随 modloader 与工具链演进，**可能过期或与最新构建不兼容**。实测例：`fabric-language-kotlin` 1.14.1 要求 `fabricloader >=0.19.5`，而某档钉 0.19.3 时 `runClient` 在依赖解析阶段直接拒启（`Incompatible mods found!`，无崩溃报告）。
- **钉值仅供参考，一律以实际解析结果与该 loader / 库的官方发布为准**；引用前按当前 maven / Modrinth 事实核对。
- 发现钉值过期或有误，请提 issue：<https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/issues>

