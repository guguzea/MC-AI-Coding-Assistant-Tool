package com.mumfrey.webprefs;

import java.io.File;
import java.net.Proxy;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.mojang.authlib.GameProfile;
import com.mojang.realmsclient.dto.RealmsServer;
import com.mumfrey.liteloader.JoinGameListener;
import com.mumfrey.liteloader.Tickable;
import com.mumfrey.liteloader.core.LiteLoader;
import com.mumfrey.webprefs.exceptions.InvalidServiceException;
import com.mumfrey.webprefs.exceptions.InvalidUUIDException;
import com.mumfrey.webprefs.framework.WebPreferencesProvider;
import com.mumfrey.webprefs.interfaces.IWebPreferences;

import net.minecraft.client.Minecraft;
import net.minecraft.client.multiplayer.ServerData;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.network.INetHandler;
import net.minecraft.network.play.server.SPacketJoinGame;
import net.minecraft.util.Session;

/**
 * WebPreferences Service Manager, acts as a central registry for all web
 * preference collections. 
 * 
 * <p>To access preferences on a service, first request the service using
 * {@link #get(String)} or {@link #getDefault()}, you can then request
 * preferences objects from the service by calling the various overloads of
 * {@link #getPreferences}.</p>
 *
 * @author Adam Mummery-Smith
 */
public final class WebPreferencesManager
{
    /**
     * WebPreferences Manager Update Daemon is injected into LiteLoader to
     * facilitate passing events to the WebPreferences Manager without having to
     * expose public callback methods.
     *
     * @author Adam Mummery-Smith
     */
    static class WebPreferencesUpdateDeamon implements Tickable, JoinGameListener
    {
        @Override
        public String getName()
        {
            return "Web Preferences Update Daemon";
        }

        @Override
        public String getVersion()
        {
            return "N/A";
        }

        @Override
        public void init(File configPath)
        {
        }

        @Override
        public void upgradeSettings(String version, File configPath, File oldConfigPath)
        {
        }

        @Override
        public void onTick(Minecraft minecraft, float partialTicks, boolean inGame, boolean clock)
        {
            if (clock)
            {
                for (WebPreferencesManager manager : WebPreferencesManager.managers.values())
                {
                    manager.onTick();
                }
            }
        }
        
        @Override
        public void onJoinGame(INetHandler netHandler, SPacketJoinGame joinGamePacket, ServerData serverData, RealmsServer realmsServer)
        {
            for (WebPreferencesManager manager : WebPreferencesManager.managers.values())
            {
                manager.onJoinGame();
            }
        }
    }
    
    /**
     * Default KV api hostname to connect to
     */
    private static final String DEFAULT_HOSTNAME = "kv.liteloader.com";

    /**
     * Regex for validating UUIDs
     */
    private static final Pattern uuidPattern = Pattern.compile("^[a-f0-9]{32}$");
    
    /**
     * Mapping of hostnames to managers
     */
    static final Map<String, WebPreferencesManager> managers = new LinkedHashMap<String, WebPreferencesManager>();
    
    /**
     * Update daemon
     */
    private static WebPreferencesUpdateDeamon updateDeamon;
    
    /**
     * Session for this instance
     */
    private final Session session;
    
    /**
     * Preference provider, manages queueing requests and passing responses back
     * to clients
     */
    private final WebPreferencesProvider provider;
    
    /**
     * All preference sets, for iteration purposes
     */
    private final List<AbstractWebPreferences> allPreferences = new LinkedList<AbstractWebPreferences>();
    
    /**
     * All public preference sets, mapped by UUID
     */
    private final Map<String, IWebPreferences> preferencesPublic = new HashMap<String, IWebPreferences>();
    
    /**
     * All private preference sets, mapped by UUID
     */
    private final Map<String, IWebPreferences> preferencesPrivate = new HashMap<String, IWebPreferences>();

    private WebPreferencesManager(Proxy proxy, Session session, String hostName)
    {
        this.session = session;
        this.provider = new WebPreferencesProvider(proxy, session, hostName, 50);
    }
    
    void onTick()
    {
        this.provider.onTick();
        
        for (AbstractWebPreferences prefs : this.allPreferences)
        {
            try
            {
                prefs.onTick();
            }
            catch (Exception ex) {}
        }
    }
    
    void onJoinGame()
    {
        for (AbstractWebPreferences prefs : this.allPreferences)
        {
            try
            {
                prefs.poll();
            }
            catch (Exception ex) {}
        }
    }

    
    /**
     * Get a public or private preferences collection for the local player. If
     * the game is running in offline mode, a local preference collection is
     * returned instead.
     * 
     * @param privatePrefs true to fetch the player's private preferences, false
     *      to fetch public preferences 
     * @return player's preference collection, creates if necessary
     */
    public IWebPreferences getLocalPreferences(boolean privatePrefs)
    {
        try
        {
            return this.getPreferences(this.session.func_148255_b(), privatePrefs);
        }
        catch (InvalidUUIDException ex)
        {
            UUID offlineUUID = EntityPlayer.func_175147_b(this.session.func_111285_a());
            return this.getOfflinePreferences(offlineUUID, privatePrefs, false, false);
        }
    }

    /**
     * Get a public preferences collection for the specified player. If the game
     * is running in offline mode, a dummy preference collection supporting no
     * operations is returned instead.
     * 
     * @param player Player to fetch preferences for
     * @return Preference collection or <tt>null</tt> if the player's profile
     *      cannot be retrieved
     */
    public IWebPreferences getPreferences(EntityPlayer player)
    {
        try
        {
            return this.getPreferences(player, false);
        }
        catch (InvalidUUIDException ex)
        {
            String playerName = player.func_70005_c_();
            UUID offlineUUID = EntityPlayer.func_175147_b(playerName);
            return this.getOfflinePreferences(offlineUUID, false, false, !playerName.equals(this.session.func_111285_a()));
        }
    }
    
    /**
     * Get a public or private preferences collection for the specified player,
     * note that accessing a private collection for another player is likely
     * to be prohibited by the service.
     * 
     * @param player Player to fetch preferences for
     * @param privatePrefs True to fetch the player's private preferences, false
     *      to fetch the public preferences
     * @return Preference collection or <tt>null</tt> if the player's profile
     *      cannot be retrieved
     */
    public IWebPreferences getPreferences(EntityPlayer player, boolean privatePrefs)
    {
        GameProfile gameProfile = player.func_146103_bH();
        return gameProfile != null ? this.getPreferences(gameProfile, privatePrefs) : null;
    }
    
    /**
     * Get a public preferences collection for the specified game profile.
     * 
     * @param gameProfile game profile to fetch preferences for 
     * @return Preference collection or <tt>null</tt> if the supplied profile is
     *      null
     */
    public IWebPreferences getPreferences(GameProfile gameProfile)
    {
        return gameProfile != null ? this.getPreferences(gameProfile, false) : null;
    }
    
    /**
     * Get a public or private preferences collection for the specified game
     * profile, note that accessing a private collection for another player is
     * likely to be prohibited by the service.
     * 
     * @param gameProfile game profile to fetch preferences for 
     * @param privatePrefs True to fetch the player's private preferences, false
     *      to fetch the public preferences
     * @return Preference collection or <tt>null</tt> if the supplied profile is
     *      null
     */
    public IWebPreferences getPreferences(GameProfile gameProfile, boolean privatePrefs)
    {
        return gameProfile != null ? this.getPreferences(gameProfile.getId(), privatePrefs) : null;
    }

    /**
     * Get a public preferences collection for the specified player UUID.
     * 
     * @param uuid UUID to fetch preferences for
     * @return Preference collection or <tt>null</tt> if the supplied UUID is
     *      null
     */
    public IWebPreferences getPreferences(UUID uuid)
    {
        return uuid != null ? this.getPreferences(uuid, false) : null;
    }

    /**
     * Get a public or private preferences collection for the specified player
     * UUID, note that accessing a private collection for another player is
     * likely to be prohibited by the service.
     * 
     * @param uuid UUID to fetch preferences for
     * @param privatePrefs True to fetch the player's private preferences, false
     *      to fetch the public preferences
     * @return Preference collection or <tt>null</tt> if the supplied UUID is
     *      null
     */
    public IWebPreferences getPreferences(UUID uuid, boolean privatePrefs)
    {
        return uuid != null ? this.getPreferences(uuid.toString(), privatePrefs) : null;
    }
    
    public IWebPreferences getPreferences(String uuid, boolean privatePrefs)
    {
        uuid = this.sanitiseUUID(uuid);
        
        Map<String, IWebPreferences> preferences = privatePrefs ? this.preferencesPrivate : this.preferencesPublic;
        IWebPreferences prefs = preferences.get(uuid);
        
        if (prefs == null)
        {
            WebPreferences newPrefs = new WebPreferences(this.provider, uuid, privatePrefs, !uuid.equals(this.session.func_148255_b()));
            this.allPreferences.add(newPrefs);
            preferences.put(uuid, newPrefs);
            prefs = newPrefs;
        }
        
        return prefs;
    }
    
    private IWebPreferences getOfflinePreferences(UUID uuid, boolean privatePrefs, boolean readOnly, boolean dummy)
    {
        Map<String, IWebPreferences> preferences = privatePrefs ? this.preferencesPrivate : this.preferencesPublic;
        IWebPreferences prefs = preferences.get(uuid);
        
        if (prefs == null)
        {
            AbstractWebPreferences newPrefs = dummy
                    ? new DummyOfflineWebPreferences(uuid, privatePrefs, readOnly)
                    : new OfflineWebPreferences(uuid, privatePrefs, readOnly);
            this.allPreferences.add(newPrefs);
            preferences.put(uuid.toString(), newPrefs);
            prefs = newPrefs;
        }
        
        return prefs;
    }
    
    private String sanitiseUUID(String uuid)
    {
        if (uuid == null)
        {
            throw new InvalidUUIDException("The UUID was null");
        }
        
        uuid = uuid.toLowerCase().replace("-", "").trim();
        Matcher uuidPatternMatcher = WebPreferencesManager.uuidPattern.matcher(uuid);
        if (!uuidPatternMatcher.matches())
        {
            throw new InvalidUUIDException("The specified string [" + uuid + "] is not a valid UUID");
        }
        
        return uuid;
    }

    /**
     * Get the default preferences manager (kv.liteloader.com)
     * 
     * @return default preferences manager
     */
    public static WebPreferencesManager getDefault()
    {
        return WebPreferencesManager.get(WebPreferencesManager.DEFAULT_HOSTNAME);
    }
    
    /**
     * Get a preferences manager for the specified service hostname
     * 
     * @param hostName service hostname (bare hostname only, no protocol)
     * @return preferences manager
     * @throws InvalidServiceException if the specified host name is invalid
     */
    @SuppressWarnings("unused")
    public static WebPreferencesManager get(String hostName) throws InvalidServiceException
    {
        try
        {
            new URI(String.format("http://%s/", hostName));
        }
        catch (URISyntaxException ex)
        {
            throw new InvalidServiceException("The specified service host was not valid: " + hostName, ex);
        }
        
        if (WebPreferencesManager.updateDeamon == null)
        {
            WebPreferencesManager.updateDeamon = new WebPreferencesUpdateDeamon();
            LiteLoader.getInterfaceManager().registerListener(WebPreferencesManager.updateDeamon);
        }
        
        WebPreferencesManager manager = WebPreferencesManager.managers.get(hostName);
        
        if (manager == null)
        {
            Minecraft minecraft = Minecraft.func_71410_x();
            
            Proxy proxy = minecraft.func_110437_J();
            Session session = minecraft.func_110432_I();
            
            manager = new WebPreferencesManager(proxy, session, hostName);
            WebPreferencesManager.managers.put(hostName, manager);
        }
        
        return manager;
    }
}
