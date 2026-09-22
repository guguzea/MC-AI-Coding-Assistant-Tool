---
title: "IExtendedEntityProperties"
description: "public interface IExtendedEntityProperties"
package: "net/minecraftforge/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/IExtendedEntityProperties.html"
sourceType: javadoc
---

# IExtendedEntityProperties

## Class signature

```java
public interface IExtendedEntityProperties
```

## Methods

- `void init(Entity entity, World world)` — Used to initialize the extended properties with the entity that this is attached to, as well as the world object.
- `void loadNBTData(NBTTagCompound compound)` — Called when the entity that this class is attached to is loaded.
- `void saveNBTData(NBTTagCompound compound)` — Called when the entity that this class is attached to is saved.
