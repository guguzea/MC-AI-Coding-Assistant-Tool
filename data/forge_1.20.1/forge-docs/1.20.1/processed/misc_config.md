# Configuration

Configurations define settings and consumer preferences that can be applied to a mod instance. Forge uses a configuration system using [TOML](https://toml.io/) files and read with [NightConfig](https://github.com/TheElectronWill/night-config).

## Creating a Configuration

A configuration can be created using a subtype of `IConfigSpec`. Forge implements the type via `ForgeConfigSpec` and enables its construction through `ForgeConfigSpec$Builder`. The builder can separate the config values into sections via `Builder#push` to create a section and `Builder#pop` to leave a section. Afterwards, the configuration can be built using one of two methods:

Method | Description
--- | ---
`build` | Creates the `ForgeConfigSpec`.
`configure` | Creates a pair of the class holding the config values and the `ForgeConfigSpec`.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note ForgeConfigSpec$Builder#configure is typically used with a static block and a class that takes in ForgeConfigSpec$Builder as part of its constructor to attach and hold the values: // In some config class ExampleConfig(ForgeConfigSpec.Builder builder) { // Define values here in final fields } // Somewhere the constructor is accessible static { Pair<ExampleConfig, ForgeConfigSpec> pair = new ForgeConfigSpec.Builder() .configure(ExampleConfig::new); // Store pair values in some constant field }

Each config value can be supplied with additional context to provide additional behavior. Contexts must be defined before the config value is fully built:

Method | Description
--- | ---
`comment` | Provides a description of what the config value does. Can provide multiple strings for a multiline comment.
`translation` | Provides a translation key for the name of the config value.
`worldRestart` | The world must be restarted before the config value can be changed.

### ConfigValue

Config values can be built with the provided contexts (if defined) using any of the `#define` methods.

All config value methods take in at least two components:

- A path representing the name of the variable: a `.` separated string representing the sections the config value is in
- The default value when no valid configuration is present

The `ConfigValue` specific methods take in two additional components:

- A validator to make sure the deserialized object is valid
- A class representing the data type of the config value


<!-- key:🟢 role:示例代码 -->

```
// For some ForgeConfigSpec$Builder builder
ConfigValue<T> value = builder.comment("Comment")
  .define("config_value_name", defaultValue);
```

The values themselves can be obtained using `ConfigValue#get`. The values are additionally cached to prevent multiple readings from files.

#### Additional Config Value Types

- **Range Values**<ul> <li>Description: Value must be between the defined bounds
- Class Type: `Comparable<T>`
- Method Name: `#defineInRange`
- Additional Components:
- The minimum and maximum the config value may be
- A class representing the data type of the config value


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note DoubleValues, IntValues, and LongValues are range values which specify the class as Double, Integer, and Long respectively.

- 
**Whitelisted Values** <ul> <li>Description: Value must be in supplied collection - Class Type: `T` - Method Name: `#defineInList` - Additional Components: - A collection of the allowed values the configuration can be <li> <p>**List Values**

- Description: Value is a list of entries
- Class Type: `List<T>`
- Method Name: `#defineList`, `#defineListAllowEmpty` if list can be empty
- Additional Components:
- A validator to make sure a deserialized element from the list is valid

<li>

**Enum Values**

- Description: An enum value in the supplied collection
- Class Type: `Enum<T>`
- Method Name: `#defineEnum`
- Additional Components:
- A getter to convert a string or integer into an enum
- A collection of the allowed values the configuration can be

<li>

**Boolean Values**

- Description: A `boolean` value
- Class Type: `Boolean`
- Method Name: `#define`

## Registering a Configuration

Once a `ForgeConfigSpec` has been built, it must be registered to allow Forge to load, track, and sync the configuration settings as required. Configurations should be registered in the mod constructor via `ModLoadingContext#registerConfig`. A configuration can be registered with a given type representing the side the config belongs to, the `ForgeConfigSpec`, and optionally a specific file name for the configuration.


<!-- key:🟢 role:示例代码 -->

```
// In the mod constructor with a ForgeConfigSpec CONFIG
ModLoadingContext.get().registerConfig(Type.COMMON, CONFIG);
```

Here is a list of the available configuration types:

Type | Loaded | Synced to Client | Client Location | Server Location | Default File Suffix
--- | --- | --- | --- | --- | ---
CLIENT | Client Side Only | No | `.minecraft/config` | N/A | `-client`
COMMON | On Both Sides | No | `.minecraft/config` | `<server_folder>/config` | `-common`
SERVER | Server Side Only | Yes | `.minecraft/saves/<level_name>/serverconfig` | `<server_folder>/world/serverconfig` | `-server`


<!-- key:🔴 role:新手必读 (Tip) -->

> **Tip**: Tip Forge documents the config types within their codebase.

## Configuration Events


<!-- key:🟠 role:常见错误 -->

Operations that occur whenever a config is loaded or reloaded can be done using the `ModConfigEvent$Loading` and `ModConfigEvent$Reloading` events. The events must be [registered](../../concepts/events/#creating-an-event-handler) to the mod event bus.


<!-- key:🔴 role:新手必读 (Warning) -->

> **Warning**: Warning These events are called for all configurations for the mod; the ModConfig object provided should be used to denote which configuration is being loaded or reloaded.