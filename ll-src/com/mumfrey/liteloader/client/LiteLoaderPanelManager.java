/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client;

import org.lwjgl.input.Keyboard;

import com.mumfrey.liteloader.client.gui.GuiLiteLoaderPanel;
import com.mumfrey.liteloader.common.GameEngine;
import com.mumfrey.liteloader.core.LiteLoader;
import com.mumfrey.liteloader.core.LiteLoaderMods;
import com.mumfrey.liteloader.core.LiteLoaderUpdateSite;
import com.mumfrey.liteloader.core.LiteLoaderVersion;
import com.mumfrey.liteloader.interfaces.PanelManager;
import com.mumfrey.liteloader.launch.LoaderEnvironment;
import com.mumfrey.liteloader.launch.LoaderProperties;
import com.mumfrey.liteloader.modconfig.ConfigManager;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiIngameMenu;
import net.minecraft.client.gui.GuiMainMenu;
import net.minecraft.client.gui.GuiOptions;
import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.resources.I18n;

/**
 * Observer which handles the display of the mod panel
 * 
 * @author Adam Mummery-Smith
 */
public class LiteLoaderPanelManager implements PanelManager<GuiScreen>
{
    /**
     * Number of launches required before an update check is forced when the
     * "force update check" option is enabled. For snapshot versions this is
     * ignored and an update check is always performed.
     */
    private static final int UPDATE_CHECK_INTERVAL = 10;

    private final LoaderEnvironment environment;

    /**
     * Loader Properties adapter 
     */
    private final LoaderProperties properties;

    private LiteLoaderMods mods;

    private ConfigManager configManager;

    private Minecraft minecraft;

    /**
     * Setting which determines whether we show the "mod info" screen tab in the
     * main menu.
     */
    private boolean displayModInfoScreenTab = true;

    /**
     * Don't hide t
     */
    private boolean tabAlwaysExpanded = false;

    /**
     * Override for the "mod info" tab setting, so that mods which want to
     * handle the mod info themselves can temporarily disable the function
     * without having to change the underlying property.
     */
    private boolean hideModInfoScreenTab = false;

    private boolean checkForUpdate = false;

    private String notification;

    /**
     * Active "mod info" screen, drawn as an overlay when in the main menu and
     * made the active screen if the user clicks the tab.
     */
    private GuiLiteLoaderPanel panelHost;

    /**
     * @param environment
     * @param properties
     */
    @SuppressWarnings("unchecked")
    public LiteLoaderPanelManager(GameEngine<?, ?> engine, LoaderEnvironment environment, LoaderProperties properties)
    {
        this.environment = environment;
        this.properties  = properties;
        this.minecraft   = ((GameEngine<Minecraft, ?>)engine).getClient();

        this.displayModInfoScreenTab = this.properties.getAndStoreBooleanProperty(LoaderProperties.OPTION_MOD_INFO_SCREEN, true);
        this.tabAlwaysExpanded = this.properties.getAndStoreBooleanProperty(LoaderProperties.OPTION_NO_HIDE_TAB, false);

        if (this.shouldCheckForUpdates())
        {
            int updateCheckInterval = this.properties.getIntegerProperty(LoaderProperties.OPTION_UPDATE_CHECK_INTR) + 1;
            LiteLoaderLogger.debug("Regular update check enabled, updateCheckInterval = %d", updateCheckInterval);

            if (LiteLoader.isSnapshot() || updateCheckInterval > LiteLoaderPanelManager.UPDATE_CHECK_INTERVAL)
            {
                LiteLoaderLogger.debug("Checking for updates...");
                this.checkForUpdate = true;
                updateCheckInterval = 0;
            }

            this.properties.setIntegerProperty(LoaderProperties.OPTION_UPDATE_CHECK_INTR, updateCheckInterval);
            this.properties.writeProperties();
        }
    }

    private boolean shouldCheckForUpdates()
    {
        if (LiteLoader.isSnapshot() && this.properties.getAndStoreBooleanProperty(LoaderProperties.OPTION_CHECK_SNAPSHOTS, true))
        {
            return true;
        }
        
        return this.properties.getAndStoreBooleanProperty(LoaderProperties.OPTION_FORCE_UPDATE, false);
    }

    @Override
    public void init(LiteLoaderMods mods, ConfigManager configManager)
    {
        this.mods          = mods;
        this.configManager = configManager;
    }

    @Override
    public void onStartupComplete()
    {
        if (this.checkForUpdate)
        {
            LiteLoaderVersion.getUpdateSite().beginUpdateCheck();
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.TickObserver
     *      #onTick(boolean, float, boolean)
     */
    @Override
    public void onTick(boolean clock, float partialTicks, boolean inGame)
    {
        if (clock && this.panelHost != null && this.minecraft.field_71462_r != this.panelHost)
        {
            this.panelHost.func_73876_c();
        }

        if (clock && this.checkForUpdate)
        {
            LiteLoaderUpdateSite updateSite = LiteLoaderVersion.getUpdateSite();
            if (!updateSite.isCheckInProgress() && updateSite.isCheckComplete())
            {
                LiteLoaderLogger.debug("Scheduled update check completed, success=%s", updateSite.isCheckSucceess());
                this.checkForUpdate = false;
                if (updateSite.isCheckSucceess() && updateSite.isUpdateAvailable())
                {
                    this.setNotification(I18n.func_135052_a("gui.notifications." + (LiteLoader.isSnapshot() ? "newsnapshotavailable" : "updateavailable"), 
                        updateSite.getAvailableVersion(), updateSite.getAvailableVersionDate()));
                }
            }
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.PostRenderObserver
     *      #onPostRender(int, int, float)
     */
    @Override
    public void onPostRender(int mouseX, int mouseY, float partialTicks)
    {
        if (this.mods == null) return;

        boolean tabHidden = this.isTabHidden() && this.minecraft.field_71462_r instanceof GuiMainMenu;

        if (this.isPanelSupportedOnScreen(this.minecraft.field_71462_r)
                && ((this.displayModInfoScreenTab && !tabHidden) || (this.panelHost != null && this.panelHost.isOpen())))
        {
            // If we're at the main menu, prepare the overlay
            if (this.panelHost == null || this.panelHost.getScreen() != this.minecraft.field_71462_r)
            {
                this.panelHost = new GuiLiteLoaderPanel(this.minecraft, this.minecraft.field_71462_r, this.mods, this.environment, this.properties,
                        this.configManager, !tabHidden);
                if (this.notification != null)
                {
                    this.panelHost.setNotification(this.notification);
                }
            }

            this.minecraft.field_71460_t.func_78478_c();
            this.panelHost.drawScreen(mouseX, mouseY, partialTicks, this.tabAlwaysExpanded);
        }
        else if (this.minecraft.field_71462_r != this.panelHost && this.panelHost != null)
        {
            // If we're in any other screen, kill the overlay
            this.panelHost.release();
            this.panelHost = null;
        }
        else if (this.isPanelSupportedOnScreen(this.minecraft.field_71462_r)
                && Keyboard.isKeyDown(Keyboard.KEY_LCONTROL)
                && Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)
                && Keyboard.isKeyDown(Keyboard.KEY_TAB))
        {
            this.displayLiteLoaderPanel(this.minecraft.field_71462_r);
        }
    }

    /**
     * Set the "mod info" screen tab to hidden, regardless of the property
     * setting.
     */
    @Override
    public void hideTab()
    {
        this.hideModInfoScreenTab = true;
    }

    private boolean isTabHidden()
    {
        return this.hideModInfoScreenTab && this.getStartupErrorCount() == 0 && this.notification == null;
    }

    /**
     * Set whether the "mod info" screen tab should be shown in the main menu
     */
    @Override
    public void setTabVisible(boolean show)
    {
        this.displayModInfoScreenTab = show;
        this.properties.setBooleanProperty(LoaderProperties.OPTION_MOD_INFO_SCREEN, show);
        this.properties.writeProperties();
    }

    /**
     * Get whether the "mod info" screen tab is shown in the main menu
     */
    @Override
    public boolean isTabVisible()
    {
        return this.displayModInfoScreenTab;
    }

    @Override
    public void setTabAlwaysExpanded(boolean expand)
    {
        this.tabAlwaysExpanded = expand;
        this.properties.setBooleanProperty(LoaderProperties.OPTION_NO_HIDE_TAB, expand);
        this.properties.writeProperties();
    }

    @Override
    public boolean isTabAlwaysExpanded()
    {
        return this.tabAlwaysExpanded;
    }

    @Override
    public void setForceUpdateEnabled(boolean forceUpdate)
    {
        this.properties.setBooleanProperty(LoaderProperties.OPTION_FORCE_UPDATE, forceUpdate);
        this.properties.writeProperties();
    }

    @Override
    public boolean isForceUpdateEnabled()
    {
        return this.properties.getBooleanProperty(LoaderProperties.OPTION_FORCE_UPDATE);
    }
    
    @Override
    public void setCheckForSnapshotsEnabled(boolean checkForSnapshots)
    {
        this.properties.setBooleanProperty(LoaderProperties.OPTION_CHECK_SNAPSHOTS, checkForSnapshots);
        this.properties.writeProperties();
    }
    
    @Override
    public boolean isCheckForSnapshotsEnabled()
    {
        return this.properties.getBooleanProperty(LoaderProperties.OPTION_CHECK_SNAPSHOTS);
    }

    /**
     * Display the liteloader panel over the specified GUI
     * 
     * @param parentScreen
     */
    @Override
    public void displayLiteLoaderPanel(GuiScreen parentScreen)
    {
        if (this.isPanelSupportedOnScreen(parentScreen))
        {
            this.panelHost = new GuiLiteLoaderPanel(this.minecraft, parentScreen, this.mods, this.environment, this.properties,
                    this.configManager, !this.isTabHidden());
            this.minecraft.func_147108_a(this.panelHost);
        }
    }

    @Override
    public int getStartupErrorCount()
    {
        return this.mods.getStartupErrorCount();
    }

    @Override
    public int getCriticalErrorCount()
    {
        return this.mods.getCriticalErrorCount();
    }

    @Override
    public void setNotification(String notification)
    {
        LiteLoaderLogger.debug("Setting notification: " + notification);
        this.notification = notification;

        if (this.panelHost != null)
        {
            this.panelHost.setNotification(notification);
        }
    }

    private boolean isPanelSupportedOnScreen(GuiScreen guiScreen)
    {
        return (guiScreen instanceof GuiMainMenu || guiScreen instanceof GuiIngameMenu || guiScreen instanceof GuiOptions);
    }
}
