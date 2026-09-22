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