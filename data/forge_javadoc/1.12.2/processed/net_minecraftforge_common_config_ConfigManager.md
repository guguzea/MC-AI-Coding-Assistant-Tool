# ConfigManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.ConfigManager

## Class signature

```java
public class ConfigManager extends java.lang.Object
```

## Constructors

- `ConfigManager()`

## Methods

- `static java.lang.Class<?>[] getModConfigClasses(java.lang.String modid)`
- `static boolean hasConfigForMod(java.lang.String modid)`
- `static void load(java.lang.String modid, Config.Type type)` — Bounces to sync().
- `static void loadData(ASMDataTable data)`
- `static void sync(java.lang.String modid, Config.Type type)` — Synchronizes configuration data between the file on disk, the Configuration object and the annotated mod classes containing the configuration variables.