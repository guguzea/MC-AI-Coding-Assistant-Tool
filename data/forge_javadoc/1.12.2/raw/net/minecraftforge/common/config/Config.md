---
title: "Config"
description: "public @interface Config"
package: "net/minecraftforge/common/config"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/config/Config.html"
sourceType: javadoc
---

# Config

## Class signature

```java
public @interface Config
```

## Elements

- `java.lang.String modid` — The mod id that this configuration is associated with.
- `java.lang.String category` — Root element category, defaults to "general", if this is an empty string then the root category is disabled.
- `java.lang.String name` — A user friendly name for the config file, the default will be modid
- `Config.Type type` — The type this is, right now the only value is INSTANCE.
