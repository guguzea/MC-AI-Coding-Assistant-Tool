---
title: "TerminalTransformer.ExitVisitor"
description: "public static class TerminalTransformer.ExitVisitor extends ClassVisitor"
package: "cpw/mods/fml/common/asm/transformers"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/asm/transformers/TerminalTransformer.ExitVisitor.html"
sourceType: javadoc
---

# TerminalTransformer.ExitVisitor

**Inheritance:** java.lang.Object → ClassVisitor → cpw.mods.fml.common.asm.transformers.TerminalTransformer.ExitVisitor

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
