---
title: "TerminalTransformer.ExitVisitor"
description: "public static class TerminalTransformer.ExitVisitor extends ClassVisitor"
package: "net/minecraftforge/fml/common/asm/transformers"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/asm/transformers/TerminalTransformer.ExitVisitor.html"
sourceType: javadoc
---

# TerminalTransformer.ExitVisitor

**Inheritance:** java.lang.Object → ClassVisitor → net.minecraftforge.fml.common.asm.transformers.TerminalTransformer.ExitVisitor

## Class signature

```java
public static class TerminalTransformer.ExitVisitor extends ClassVisitor
```

## Methods

- `static void runtimeExitCalled(java.lang.Runtime runtime, int status)`
- `static void runtimeHaltCalled(java.lang.Runtime runtime, int status)`
- `static void systemExitCalled(int status)`
- `void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `MethodVisitor visitMethod(int mAccess, java.lang.String mName, java.lang.String mDesc, java.lang.String mSignature, java.lang.String[] mExceptions)`
