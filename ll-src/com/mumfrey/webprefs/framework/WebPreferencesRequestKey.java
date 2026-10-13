package com.mumfrey.webprefs.framework;

import java.util.HashSet;
import java.util.Set;

import net.minecraft.util.Session;

import com.mumfrey.webprefs.interfaces.IWebPreferencesRequest;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceDelegate;

public class WebPreferencesRequestKey extends WebPreferencesRequestAbstract
{
    private static final long serialVersionUID = 1L;

    protected final transient WebPreferencesService server;

    public WebPreferencesRequestKey(final WebPreferencesService server, final Session session, final String hostName)
    {
        super(new IWebPreferencesServiceDelegate()
        {
            @Override
            public void onRequestFailed(IWebPreferencesRequest request, Throwable th, RequestFailureReason reason)
            {
                server.handleKeyRequestFailed(th);
            }

            @Override
            public void onReceivedResponse(IWebPreferencesRequest request, IWebPreferencesResponse response)
            {
                server.handleKeyRequestCompleted(response);
            }

            @Override
            public Session getSession()
            {
                return session;
            }

            @Override
            public String getHostName()
            {
                return hostName;
            }
        }, session.func_148255_b());

        this.server = server;
    }
    
    @Override
    public boolean isValidationRequired()
    {
        return true;
    }
    
    @Override
    protected String getPath()
    {
        return "/key";
    }
    
    @Override
    protected void validateResponse(IWebPreferencesResponse response)
    {
    }

    @Override
    public Set<String> getKeys()
    {
        return new HashSet<String>();
    }
}
