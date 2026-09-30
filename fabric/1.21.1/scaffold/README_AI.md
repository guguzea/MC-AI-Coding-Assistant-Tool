# Fabric Example Mod - README

This is a template project for creating a Fabric mod for Minecraft 1.21.1.

## Requirements

- Java 21
- Gradle 8.10+

## Getting Started

1. Open this project in your IDE
2. Run `./gradlew genSources` to download Minecraft and Yarn mappings
3. Run `./gradlew build` to build the mod JAR
4. The output JAR will be in `build/libs/`

## Project Structure

```
src/main/java/com/example/examplemod/
├── ExampleMod.java           # Main mod entry point
├── ExampleModClient.java     # Client-side mod entry point
├── ExampleAnimalEntity.java  # Example entity class
└── mixin/
    ├── ExampleMixin.java     # Server-side mixin example
    └── client/
        └── ExampleMixin.java # Client-side mixin example
```

## Configuration

Edit `gradle.properties` to configure mod properties:

```properties
mod_version=1.0.0
mod_id=examplemod
mod_name=Example Mod
minecraft_version=1.21.1
yarn_mappings=1.21.1+build.2
loader_version=0.16.9
fabric_api_version=0.115.6+1.21.1
```

## Building

```bash
# Build the mod
./gradlew build

# Build without running tests
./gradlew build --no-build-cache --rerun-tasks

# Clean and rebuild
./gradlew clean build

# Run data generation
./gradlew runDatagen
```

## Running

Place the built JAR in your Minecraft mods folder:
- Windows: `%APPDATA%\.minecraft\mods\`
- macOS: `~/Library/Application Support/minecraft/mods/`
- Linux: `~/.minecraft/mods/`

## Key Files

- `build.gradle` - Build configuration
- `settings.gradle` - Project settings
- `gradle.properties` - Version configuration
- `fabric.mod.json` - Mod metadata
- `src/main/resources/examplemod.mixins.json` - Mixin configuration

## 兼容声明（钉值）

- 本目录 `gradle.properties` / `build.gradle` 里的版本钉值随 modloader 与工具链演进，**可能过期或与最新构建不兼容**。实测例：`fabric-language-kotlin` 1.14.1 要求 `fabricloader >=0.19.5`，而某档钉 0.19.3 时 `runClient` 在依赖解析阶段直接拒启（`Incompatible mods found!`，无崩溃报告）。
- **钉值仅供参考，一律以实际解析结果与该 loader / 库的官方发布为准**；引用前按当前 maven / Modrinth 事实核对。
- 发现钉值过期或有误，请提 issue：<https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/issues>

