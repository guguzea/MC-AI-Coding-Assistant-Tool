package com.mumfrey.webprefs.framework;

import net.minecraft.util.Session;

import com.mumfrey.webprefs.interfaces.IWebPreferencesClient;
import com.mumfrey.webprefs.interfaces.IWebPreferencesProvider;
import com.mumfrey.webprefs.interfaces.IWebPreferencesRequest;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceDelegate;

abstract class WebPreferencesServiceTask implements IWebPreferencesServiceDelegate
{
    private final IWebPreferencesProvider provider;

    private final IWebPreferencesClient client;

    private IWebPreferencesRequest request;
    
    WebPreferencesServiceTask(IWebPreferencesProvider provider, IWebPreferencesClient client)
    {
        this.provider = provider;
        this.client = client;
    }
    
    public IWebPreferencesClient getClient()
    {
        return this.client;
    }

    public IWebPreferencesRequest getRequest()
    {
        return this.request;
    }

    public void setRequest(IWebPreferencesRequest request)
    {
        this.request = request;
    }
    
    @Override
    public String getHostName()
    {
        return this.provider.getHostName();
    }
    
    @Override
    public Session getSession()
    {
        return this.provider.getSession();
    }

    @Override
    public String toString()
    {
        return String.format("%s[%s]", this.getClass().getSimpleName(), this.request);
    }
}
