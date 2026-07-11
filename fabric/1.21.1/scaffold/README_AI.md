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
fabric_api_version=0.200.1+build.3
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
