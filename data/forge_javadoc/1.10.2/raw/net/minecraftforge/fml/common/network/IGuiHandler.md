---
title: "IGuiHandler"
description: "public interface IGuiHandler"
package: "net/minecraftforge/fml/common/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/IGuiHandler.html"
sourceType: javadoc
---

# IGuiHandler

## Class signature

```java
public interface IGuiHandler
```

## Methods

- `java.lang.Object getClientGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z)` — Returns a Container to be displayed to the user.
- `java.lang.Object getServerGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z)` — Returns a Server side Container to be displayed to the user.
