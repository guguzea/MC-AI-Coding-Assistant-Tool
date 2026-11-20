package com.bandd.playtest.fabric1211;

import com.bandd.playtest.PlaytestMod;
import com.terraformersmc.modmenu.api.ConfigScreenFactory;
import com.terraformersmc.modmenu.api.ModMenuApi;
import net.minecraft.client.gui.screen.Screen;

/**
 * **社区惯例的注册点**：ModMenu 的「Mods 列表 → 本模组 → Config」按钮。
 *
 * <p>件内证据：ModMenu 17.0.1（1.21.11）的 {@code ModMenuApi#getModConfigScreenFactory()}
 * 返回 {@code ConfigScreenFactory<?>}，后者的抽象方法是 {@code S create(Screen)}
 * —— 本机 {@code javap -p -cp D:\mc-skill-temp\t3\modmenu-17.0.1.jar} 原文。
 *
 * <p>**ModMenu 不是本模组的必需前置**：{@code build.gradle} 只用 {@code modCompileOnly}，
 * {@code fabric.mod.json} 也没有把它写进 {@code depends} ⇒ 没装 ModMenu 时这个 entrypoint
 * 根本不会被调用，本模组照常工作，另有全局按键 O 打开同一个设置页（见 {@link PlaytestMod}）。
 */
public final class ClothModMenu implements ModMenuApi {

    @Override
    public ConfigScreenFactory<?> getModConfigScreenFactory() {
        ConfigScreenFactory<Screen> factory = parent -> PlaytestMod.openSettingsScreen(parent);
        return factory;
    }
}
