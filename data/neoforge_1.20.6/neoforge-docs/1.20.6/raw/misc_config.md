---
title: "Miscellaneous"
version: "1.20.6"
pageId: "misc/config"
url: "https://docs.neoforged.net/docs/1.20.6/misc/config/"
platform: "neoforge"
fetchedAt: "2026-06-01T10:54:15.231Z"
---
# Configuration

Configurations define settings and consumer preferences that can be applied to a mod instance. NeoForge uses a configuration system using [TOML](https://toml.io/) files and read with [NightConfig](https://github.com/TheElectronWill/night-config).

## Creating a Configuration

A configuration can be created using a subtype of `IConfigSpec`. NeoForge implements the type via `ModConfigSpec` and enables its construction through `ModConfigSpec.Builder`. The builder can separate the config values into sections via `Builder#push` to create a section and `Builder#pop` to leave a section. Afterwards, the configuration can be built using one of two methods:

| Method | Description |
| --- | --- |
| Method | Description |
| build | Creates the ModConfigSpec. |
| configure | Creates a pair of the class holding the config values and the ModConfigSpec. |

> **Note**
> note

`ModConfigSpec.Builder#configure` is typically used with a `static` block and a class that takes in `ModConfigSpec.Builder` as part of its constructor to attach and hold the values:

```java

// In some config class

ExampleConfig(ModConfigSpec.Builder builder) {

    // Define values here in final fields

}

// Somewhere the constructor is accessible

static {

    Pair<ExampleConfig, ModConfigSpec> pair = new ModConfigSpec.Builder()

        .configure(ExampleConfig::new);

    // Store pair values in some constant field

}

```

Each config value can be supplied with additional context to provide additional behavior. Contexts must be defined before the config value is fully built:

| Method | Description |
| --- | --- |
| Method | Description |
| comment | Provides a description of what the config value does. Can provide multiple strings for a multiline comment. |
| translation | Provides a translation key for the name of the config value. |
| worldRestart | The world must be restarted before the config value can be changed. |

### ConfigValue

Config values can be built with the provided contexts (if defined) using any of the `#define` methods.

All config value methods take in at least two components:

- A path representing the name of the variable: a `.` separated string representing the sections the config value is in
- The default value when no valid configuration is present

The `ConfigValue` specific methods take in two additional components:

- A validator to make sure the deserialized object is valid
- A class representing the data type of the config value

```java

// For some ModConfigSpec.Builder builder

ConfigValue<T> value = builder.comment("Comment")

    .define("config_value_name", defaultValue);

```

The values themselves can be obtained using `ConfigValue#get`. The values are additionally cached to prevent multiple readings from files.

#### Additional Config Value Types

- **Range Values**

Description: Value must be between the defined bounds
- Class Type: `Comparable`
- Method Name: `#defineInRange`
- Additional Components:

The minimum and maximum the config value may be
- A class representing the data type of the config value

</li>
</ul>
</li>
</ul>

> **Note**
> note

`DoubleValue`s, `IntValue`s, and `LongValue`s are range values which specify the class as `Double`, `Integer`, and `Long` respectively.

- **Whitelisted Values**

Description: Value must be in supplied collection
- Class Type: `T`
- Method Name: `#defineInList`
- Additional Components:

A collection of the allowed values the configuration can be

</li>
</ul>
</li>
<li class="">

**List Values**

- Description: Value is a list of entries
- Class Type: `List`
- Method Name: `#defineList`, `#defineListAllowEmpty` if list can be empty
- Additional Components:

A validator to make sure a deserialized element from the list is valid

</li>
</ul>
</li>
<li class="">

**Enum Values**

- Description: An enum value in the supplied collection
- Class Type: `Enum`
- Method Name: `#defineEnum`
- Additional Components:

A getter to convert a string or integer into an enum
- A collection of the allowed values the configuration can be

</li>
</ul>
</li>
<li class="">

**Boolean Values**

- Description: A `boolean` value
- Class Type: `Boolean`
- Method Name: `#define`

</li>
</ul>

## Registering a Configuration

Once a `ModConfigSpec` has been built, it must be registered to allow NeoForge to load, track, and sync the configuration settings as required. Configurations should be registered in the mod constructor via `ModContainer#registerConfig`. A configuration can be registered with a [given type](#configuration-types) representing the side the config belongs to, the `ModConfigSpec`, and optionally a specific file name for the configuration.

```java

// In the main mod file with a ModConfigSpec CONFIG_SPEC

public ExampleMod(ModContainer container) {

    container.registerConfig(ModConfig.Type.COMMON, CONFIG_SPEC);

    // Do other things

}

```

### Configuration Types

Configuration types determine where the configuration file is located, what time it is loaded, and whether the file is synced across the network. All configurations are, by default, either loaded from `.minecraft/config` on the physical client or `/config` on the physical server. Some nuances between each configuration type can be found in the following subsections.

> **Tip**
> tip

NeoForge documents the [config types](https://github.com/neoforged/FancyModLoader/blob/1b6af92893464a4f477cab310256639f39d41ea7/loader/src/main/java/net/neoforged/fml/config/ModConfig.java#L81-L114) within their codebase.

- `STARTUP`

Loaded on both the physical client and physical server from the config folder
- Read immediately on registration
- **NOT** synced across the network
- Suffixed with `-startup` by default

</li>
</ul>

> **Warning**
> warning

Configurations registered under the `STARTUP` type can cause desyncs between the client and server, such as if the configuration is used to disable the registration of content. Therefore, it is highly recommended that any configurations within `STARTUP` are not used to enable or disable features that may change the content of the mod.

- `CLIENT`

Loaded **ONLY** on the physical client from the config folder

There is no server location for this configuration type

</li>
<li class="">Read immedately before `FMLCommonSetupEvent` is fired</li>
<li class="">**NOT** synced across the network</li>
<li class="">Suffixed with `-client` by default</li>
</ul>
</li>
<li class="">`COMMON`

- Loaded on both the physical client and physical server from the config folder
- Read immedately before `FMLCommonSetupEvent` is fired
- **NOT** synced across the network
- Suffixed with `-common` by default

</li>
<li class="">`SERVER`

- Loaded on both the physical client and physical server from the config folder

Can be overridden for each world by adding a config to:

Client: `.minecraft/saves//serverconfig`
- Server: `/world/serverconfig`

</li>
</ul>
</li>
<li class="">Read immedately before `ServerAboutToStartEvent` is fired</li>
<li class="">Synced across the network to the client</li>
<li class="">Suffixed with `-server` by default</li>
</ul>
</li>
</ul>

## Configuration Events

Operations that occur whenever a config is loaded or reloaded can be done using the `ModConfigEvent.Loading` and `ModConfigEvent.Reloading` events. The events must be [registered](/docs/1.20.6/concepts/events#registering-an-event-handler) to the mod event bus.

> **Caution**
> caution

These events are called for all configurations for the mod; the `ModConfig` object provided should be used to denote which configuration is being loaded or reloaded.
