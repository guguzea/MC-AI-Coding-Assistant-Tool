# IASMHook

## Class signature

```java
public interface IASMHook
```

## Methods

- `ClassNode[] inject(ClassNode modClassNode)` — Inject the Mod class node into this instance.
- `void modifyClass(java.lang.String className, ClassNode node)` — Allow mods to manipulate classes loaded from this Mod 's jar file.