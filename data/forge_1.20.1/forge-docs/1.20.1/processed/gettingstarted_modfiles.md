# Mod Files

The mod files are responsible for determining what mods are packaged into your JAR, what information to display within the &lsquo;Mods&rsquo; menu, and how your mod should be loaded in the game.

## mods.toml

The `mods.toml` file defines the metadata of your mod(s). It also contains additional information that is displayed within the &lsquo;Mods&rsquo; menu and how your mod(s) should be loaded into the game.

The file uses the [Tom&rsquo;s Obvious Minimal Language, or TOML](https://toml.io/), format. The file must be stored under the `META-INF` folder in the resource directory of the source set you are using (`src/main/resources/META-INF/mods.toml` for the `main` source set). A `mods.toml` file may look something like this:

```toml
modLoader="javafml"
loaderVersion="[46,)"

license="All Rights Reserved"
issueTrackerURL="https://github.com/MinecraftForge/MinecraftForge/issues"
showAsResourcePack=false

[[mods]]
  modId="examplemod"
  version="1.0.0.0"
  displayName="Example Mod"
  updateJSONURL="https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json"
  displayURL="https://minecraftforge.net"
  logoFile="logo.png"
  credits="I'd like to thank my mother and father."
  authors="Author"
  description='''
  Lets you craft dirt into diamonds. This is a traditional mod that has existed for eons. It is ancient. The holy Notch created it. Jeb rainbowfied it. Dinnerbone made it upside down. Etc.
  '''
  displayTest="MATCH_VERSION"

[[dependencies.examplemod]]
  modId="forge"
  mandatory=true
  versionRange="[46,)"
  ordering="NONE"
  side="BOTH"

[[dependencies.examplemod]]
  modId="minecraft"
  mandatory=true
  versionRange="[1.20]"
  ordering="NONE"
  side="BOTH"
```

`mods.toml` is broken into three parts: the non-mod-specific properties, which are linked to the mod file; the mod properties, with a section for each mod; and the dependency configurations, with a section for each mod&rsquo;s or mods&rsquo; dependencies. Each of the properties associated with the `mods.toml` file will be explained below, where `required` means that a value must be specified or an exception will be thrown.

### Non-Mod-Specific Properties

Non-mod-specific properties are properties associated with the JAR itself, indicating how to load the mod(s) and any additional global metadata.

Property | Type | Default | Description | Example
--- | --- | --- | --- | ---
`modLoader` | string | **mandatory** | The language loader used by the mod(s). Can be used to support alternative language structures, such as Kotlin objects for the main file, or different methods of determining the entrypoint, such as an interface or method. Forge provides the Java loader `"javafml"` and low/no code loader `"lowcodefml"`. | `"javafml"`
`loaderVersion` | string | **mandatory** | The acceptable version range of the language loader, expressed as a [Maven Version Range](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html). For `javafml` and `lowcodefml`, the version is the major version of the Forge version. | `"[46,)"`
`license` | string | **mandatory** | The license the mod(s) in this JAR are provided under. It is suggested that this is set to the [SPDX identifier](https://spdx.org/licenses/) you are using and/or a link to the license. You can visit https://choosealicense.com/ to help pick the license you want to use. | `"MIT"`
`showAsResourcePack` | boolean | `false` | When `true`, the mod(s)&rsquo;s resources will be displayed as a separate resource pack on the &lsquo;Resource Packs&rsquo; menu, rather than being combined with the &lsquo;Mod resources&rsquo; pack. | `true`
`services` | array | `[]` | An array of services your mod **uses**. This is consumed as part of the created module for the mod from Forge&rsquo;s implementation of the Java Platform Module System. | `["net.minecraftforge.forgespi.language.IModLanguageProvider"]`
`properties` | table | `{}` | A table of substitution properties. This is used by `StringSubstitutor` to replace `${file.<key>}` with its corresponding value. This is currently only used to replace the `version` in the [mod-specific properties](#mod-specific-properties). | `{ "example" = "1.2.3" }` referenced by `${file.example}`
`issueTrackerURL` | string | _*${1}_ | A URL representing the place to report and track issues with the mod(s). | `"https://forums.minecraftforge.net/"`


<!-- key:🔴 role:新手必读 (Important) -->

> **Important**: Important The services property is functionally equivalent to specifying the uses directive in a module, which allows loading a service of a given type.

### Mod-Specific Properties

Mod-specific properties are tied to the specified mod using the `[[mods]]` header. This is an [array of tables](https://toml.io/en/v1.0.0#array-of-tables); all key/value properties will be attached to that mod until the next header.

```
# Properties for examplemod1
[[mods]]
modId = "examplemod1"

# Properties for examplemod2
[[mods]]
modId = "examplemod2"
```

Property | Type | Default | Description | Example
--- | --- | --- | --- | ---
`modId` | string | **mandatory** | The unique identifier representing this mod. The id must match `^[a-z][a-z0-9_]{1,63}$` (a string 2-64 characters; starts with a lowercase letter; made up of lowercase letters, numbers, or underscores). | `"examplemod"`
`namespace` | string | value of `modId` | An override namespace for the mod. The namespace much match `^[a-z][a-z0-9_.-]{1,63}$` (a string 2-64 characters; starts with a lowercase letter; made up of lowercase letters, numbers, underscores, dots, or dashes). Currently unused. | `"example"`
`version` | string | `"1"` | The version of the mod, preferably in a [variation of Maven versioning](../versioning/). When set to `${file.jarVersion}`, it will be replaced with the value of the `Implementation-Version` property in the JAR&rsquo;s manifest (displays as `0.0NONE` in a development environment). | `"1.20-1.0.0.0"`
`displayName` | string | value of `modId` | The pretty name of the mod. Used when representing the mod on a screen (e.g., mod list, mod mismatch). | `"Example Mod"`
`description` | string | `"MISSING DESCRIPTION"` | The description of the mod shown in the mod list screen. It is recommended to use a [multiline literal string](https://toml.io/en/v1.0.0#string). | `"This is an example."`
`logoFile` | string | _*${1}_ | The name and extension of an image file used on the mods list screen. The logo must be in the root of the JAR or directly in the root of the source set (e.g., `src/main/resources` for the main source set). | `"example_logo.png"`
`logoBlur` | boolean | `true` | Whether to use `GL_LINEAR*` (true) or `GL_NEAREST*` (false) to render the `logoFile`. | `false`
`updateJSONURL` | string | _*${1}_ | A URL to a JSON used by the [update checker](../../misc/updatechecker/) to make sure the mod you are playing is the latest version. | `"https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json"`
`features` | table | `{}` | See &lsquo;[features](#features)&rsquo;. | `{ java_version = "17" }`
`modproperties` | table | `{}` | A table of key/values associated with this mod. Currently unused by Forge, but is mainly for use by mods. | `{ example = "value" }`
`modUrl` | string | _*${1}_ | A URL to the download page of the mod. Currently unused. | `"https://files.minecraftforge.net/"`
`credits` | string | _*${1}_ | Credits and acknowledges for the mod shown on the mod list screen. | `"The person over here and there."`
`authors` | string | _*${1}_ | The authors of the mod shown on the mod list screen. | `"Example Person"`
`displayURL` | string | _*${1}_ | A URL to the display page of the mod shown on the mod list screen. | `"https://minecraftforge.net/"`
`displayTest` | string | `"MATCH_VERSION"` | See &lsquo;[sides](../../concepts/sides/#writing-one-sided-mods)&rsquo;. | `"NONE"`

#### Features

The features system allows mods to demand that certain settings, software, or hardware are available when loading the system. When a feature is not satisfied, mod loading will fail, informing the user about the requirement. Currently, Forge provides the following features:

Feature | Description | Example
--- | --- | ---
`java_version` | The acceptable version range of the Java version, expressed as a [Maven Version Range](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html). This should be the supported version used by Minecraft. | `"[17,)"`

### Dependency Configurations

Mods can specify their dependencies, which are checked by Forge before loading the mods. These configurations are created using the [array of tables](https://toml.io/en/v1.0.0#array-of-tables) `[[dependencies.<modid>]]` where `modid` is the identifier of the mod the dependency is for.

Property | Type | Default | Description | Example
--- | --- | --- | --- | ---
`modId` | string | **mandatory** | The identifier of the mod added as a dependency. | `"example_library"`
`mandatory` | boolean | **mandatory** | Whether the game should crash when this dependency is not met. | `true`
`versionRange` | string | `""` | The acceptable version range of the language loader, expressed as a [Maven Version Range](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html). An empty string matches any version. | `"[1, 2)"`
`ordering` | string | `"NONE"` | Defines if the mod must load before (`"BEFORE"`) or after (`"AFTER"`) this dependency. If the ordering does not matter, return `"NONE"` | `"AFTER"`
`side` | string | `"BOTH"` | The [physical side](../../concepts/sides/#different-kinds-of-sides) the dependency must be present on: `"CLIENT"`, `"SERVER"`, or `"BOTH"`. | `"CLIENT"`
`referralUrl` | string | _*${1}_ | A URL to the download page of the dependency. Currently unused. | `"https://library.example.com/"`


<!-- key:🔴 role:新手必读 (Warning) -->

> **Warning**: Warning The ordering of two mods may cause a crash due to a cyclic dependency: for example, mod A must load "BEFORE" mod B and mod B "BEFORE" mod A.

## Mod Entrypoints

Now that the `mods.toml` is filled out, we need to provide an entrypoint to being programming the mod. Entrypoints are essentially the starting point for executing the mod. The entrypoint itself is determined by the language loader used in the `mods.toml`.

### `javafml and <code>@Mod

<code>javafml` is a language loader provided by Forge for the Java programming language. The entrypoint is defined using a public class with the `@Mod` annotation. The value of `@Mod` must contain one of the mod ids specified within the `mods.toml`. From there, all initialization logic (e.g., [registering events](../../concepts/events/), [adding `DeferredRegister`s](../../concepts/registries/#deferredregister)) can be specified within the constructor of the class. The mod bus can be obtained from `FMLJavaModLoadingContext`.


<!-- key:🟢 role:示例代码 -->

```java
@Mod("examplemod") // Must match mods.toml
public class Example {

  public Example() {
    // Initialize logic here
    var modBus = FMLJavaModLoadingContext.get().getModEventBus();

    // ...
  }
}
```

### `lowcodefml

<code>lowcodefml` is a language loader used as a way to distribute datapacks and resource packs as mods without the need of an in-code entrypoint. It is specified as `lowcodefml` rather than `nocodefml` for minor additions in the future that might require minimal coding.