package com.mumfrey.webprefs.interfaces;

import java.util.Map;
import java.util.Set;

import net.minecraft.util.Session;

public interface IWebPreferencesProvider
{
    public abstract boolean isActive();

    public abstract String getHostName();

    public abstract Session getSession();
    
    public abstract IWebPreferencesService getService();

    public boolean requestGet(IWebPreferencesClient client, String uuid, Set<String> keys, boolean getPrivate);

    public boolean requestSet(IWebPreferencesClient client, String uuid, Map<String, String> values, boolean setPrivate);
}
