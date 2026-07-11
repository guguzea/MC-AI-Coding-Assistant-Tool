# 代理模式

## 通用代理

```java
package com.example.examplemod;

import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;

public class CommonProxy {

    // 预初始化
    public void preInit(FMLPreInitializationEvent event) {
    }

    // 初始化
    public void init(FMLInitializationEvent event) {
    }

    // 后初始化
    public void postInit(FMLPostInitializationEvent event) {
    }

    // 注册渲染器
    public void registerRenderers() {
    }

    // 注册颜色处理器
    public void registerColorHandlers() {
    }
}
```

## 客户端代理

```java
package com.example.examplemod.client;

import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;
import net.minecraftforge.client.event.ModelRegistryEvent;
import net.minecraftforge.client.model.ModelLoader;
import net.minecraftforge.client.model.ModelRotation;
import net.minecraftforge.fml.client.registry.ClientRegistry;
import net.minecraftforge.fml.common.event.FMLMissingMappingsEvent;
import net.minecraftforge.fml.relauncher.SideOnly;
import net.minecraftforge.fml.relauncher.Side;
import com.example.examplemod.CommonProxy;

@SideOnly(Side.CLIENT)
public class ClientProxy extends CommonProxy {

    @Override
    public void preInit(FMLPreInitializationEvent event) {
        super.preInit(event);
    }

    @Override
    public void init(FMLInitializationEvent event) {
        super.init(event);
    }

    @Override
    public void postInit(FMLPostInitializationEvent event) {
        super.postInit(event);
    }

    @Override
    public void registerRenderers() {
        // 注册实体渲染器
        // RenderingRegistry.registerEntityRenderingHandler(MyEntity.class, RenderFactory::new);

        // 注册 TileEntity 特殊渲染
        // ClientRegistry.bindTileEntitySpecialRenderer(MyTileEntity.class, new MyTESR());
    }

    @Override
    public void registerColorHandlers() {
        // 注册方块/物品颜色处理器
    }
}
```

## 主类使用

```java
@Mod(modid = ExampleMod.MOD_ID)
public class ExampleMod {

    @SidedProxy(
        clientSide = "com.example.examplemod.client.ClientProxy",
        serverSide = "com.example.examplemod.CommonProxy"
    )
    public static CommonProxy proxy;

    @EventHandler
    public void preInit(FMLPreInitializationEvent event) {
        proxy.preInit(event);
    }

    @EventHandler
    public void init(FMLInitializationEvent event) {
        proxy.init(event);
    }

    @EventHandler
    public void postInit(FMLPostInitializationEvent event) {
        proxy.postInit(event);
    }
}
```

## 常见使用场景

| 场景 | CommonProxy | ClientProxy |
|------|-------------|-------------|
| 注册方块/物品 | ✅ | |
| 注册 TileEntity | ✅ | |
| 注册实体 | ✅ | |
| 注册实体渲染器 | | ✅ |
| 注册 TESR | | ✅ |
| 注册颜色处理器 | | ✅ |
| 注册粒子 | | ✅ |
| 预加载资源 | | ✅ |
