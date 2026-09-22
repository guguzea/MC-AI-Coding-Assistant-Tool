---
title: "IASMHook"
description: "public interface IASMHook"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/IASMHook.html"
sourceType: javadoc
---

# IASMHook

## Class signature

```java
public interface IASMHook
```

## Methods

- `ClassNode[] inject(ClassNode modClassNode)` — Inject the Mod class node into this instance.
- `void modifyClass(java.lang.String className, ClassNode node)` — Allow mods to manipulate classes loaded from this Mod 's jar file.
