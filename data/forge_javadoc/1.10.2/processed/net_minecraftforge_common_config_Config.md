# Config

## Class signature

```java
public @interface Config
```

## Elements

- `java.lang.String modid` — The mod id that this configuration is associated with.
- `java.lang.String name` — A user friendly name for the config file, the default will be modid
- `Config.Type type` — The type this is, right now the only value is INSTANCE.