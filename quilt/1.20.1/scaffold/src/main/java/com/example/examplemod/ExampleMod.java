package com.example.examplemod;

import net.fabricmc.api.ModInitializer;

/**
 * 入口点：quilt.mod.json 的 entrypoints.main。
 *
 * quilt-loader 0.31.0-beta.4（本档钉值）已删除 Quilt 原生的
 * org.quiltmc.loader.api.entrypoint.ModInitializer（javap 实测 0 命中，2026-10-01），
 * 官方替代是 QSL 的 org.quiltmc.qsl.base.api.entrypoint.ModInitializer
 * （onInitialize(ModContainer)；构件 org.quiltmc.qsl.core:qsl_base，javap 实测签名）。
 * 本档 MC 版本在 maven 上有 QSL 构件 6.3.0+1.20.1（2026-10-01 实测）。
 * 故本档按 quilt-loader 自带的 Fabric 兼容接口（@Deprecated）落笔，零额外依赖；
 * 要改用 QSL 见本档 .cursor/rules/00-project-setup.mdc。
 */
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        // 简单注册用 Vanilla Registry.register；不要调用 Fabric RegistrySync
    }
}
