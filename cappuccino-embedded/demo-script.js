// demo-script.js - Enhanced JavaScript untuk Cappuccino Chat Widget Demo dengan Security Features

class EnhancedCappuccinoChatDemo {
    constructor() {
        this.widget = null;
        this.isInitialized = false;
        this.currentTheme = 'light';
        this.currentPageTheme = 'light';
        this.securityEvents = [];
        
        // Configuration
        this.config = {
            apiKey: '',
            baseUrlApi: '',
            baseUrlWs: '',
            theme: 'light',
            mode: 'full',
            ticketId: '',
            resourcesBaseUrl: '',
            // Security options
            autoAddCSP: true,
            enforceHTTPS: true,
            debug: true
        };

        // Environment detection
        this.environment = this.detectEnvironment();
        
        // Initialize demo
        this.init();
    }

    // Environment detection with enhanced security context
    detectEnvironment() {
        const isHttps = window.location.protocol === 'https:';
        const isSecureContext = window.isSecureContext || false;
        const isDevelopment = 
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('.local') ||
            window.location.port !== '';

        return {
            isHttps,
            isSecureContext,
            isDevelopment,
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            recommended: isDevelopment && !isHttps ? 'HTTP/WS' : 'HTTPS/WSS',
            userAgent: navigator.userAgent,
            cookieEnabled: navigator.cookieEnabled
        };
    }

    // Get smart default URLs based on environment
    getSmartDefaultUrls() {
        // Untuk development localhost, gunakan HTTP/WS
        if (this.environment.isDevelopment && !this.environment.isHttps) {
            return {
                api: 'http://localhost:8000',
                ws: 'ws://localhost:8000',
                resources: 'http://localhost:3012'
            };
        }

        // Untuk production atau HTTPS, gunakan HTTPS/WSS
        return {
            api: 'https://cappucino-api.bsa.id',
            ws: 'wss://cappucino-api.bsa.id',
            resources: 'https://cappucino.bsa.id'
        };
    }

    // Enhanced URL validation with security checks
    validateUrl(url, type) {
        // if (!url) return url;

        // const originalUrl = url;
        // let isSecurityChange = false;

        // // Untuk development localhost, biarkan user pilih protokol
        // if (this.environment.isDevelopment && !this.environment.isHttps) {
        //     return url;
        // }

        // // Untuk production atau HTTPS page, enforce secure protocols
        // if (type === 'api' && url.startsWith('http://')) {
        //     const httpsUrl = url.replace('http://', 'https://');
        //     this.showToast('🔒 URL converted to HTTPS for security', 'warning');
        //     this.logSecurityEvent('url_auto_upgrade', { 
        //         type: 'api', 
        //         original: originalUrl, 
        //         converted: httpsUrl,
        //         reason: 'Mixed content prevention'
        //     });
        //     isSecurityChange = true;
        //     return httpsUrl;
        // }

        // if (type === 'ws' && url.startsWith('ws://')) {
        //     const wssUrl = url.replace('ws://', 'wss://');
        //     this.showToast('🔒 WebSocket URL converted to WSS for security', 'warning');
        //     this.logSecurityEvent('websocket_auto_upgrade', {
        //         type: 'websocket',
        //         original: originalUrl,
        //         converted: wssUrl,
        //         reason: 'Mixed content prevention'
        //     });
        //     isSecurityChange = true;
        //     return wssUrl;
        // }

        return url;
    }

    // Log security events
    logSecurityEvent(type, data) {
        const event = {
            type,
            data,
            timestamp: new Date().toISOString(),
            source: 'demo'
        };

        this.securityEvents.push(event);
        console.log('[Security Event]', event);
        
        // Update security events display
        this.updateSecurityEventsDisplay();
        
        // Emit custom event
        window.dispatchEvent(new CustomEvent('demo-security-event', { detail: event }));
    }

    // Initialize demo with enhanced security monitoring
    init() {
        console.log('[Demo] Initializing enhanced demo...', this.environment);
        
        // Set smart defaults
        const defaults = this.getSmartDefaultUrls();
        this.config = {
            ...this.config,
            baseUrlApi: defaults.api,
            baseUrlWs: defaults.ws,
            resourcesBaseUrl: defaults.resources
        };

        // Setup UI
        this.setupUI();
        this.bindEvents();
        this.updateEnvironmentInfo();
        this.loadFormValues();
        this.setupSecurityMonitoring();
        this.updateSecurityStatus();

        // Show protocol switcher in development
        if (this.environment.isDevelopment) {
            document.getElementById('protocolSwitcher').classList.remove('hidden');
        }

        // Show security events panel
        document.getElementById('security-events-panel').classList.remove('hidden');

        console.log('[Demo] Enhanced demo initialized successfully');
        this.logSecurityEvent('demo_initialized', {
            environment: this.environment,
            defaultConfig: defaults
        });
    }

    // Setup enhanced UI elements
    setupUI() {
        // Set initial form values
        document.getElementById('baseUrlApi').value = this.config.baseUrlApi;
        document.getElementById('baseUrlWs').value = this.config.baseUrlWs;
        document.getElementById('resourcesBaseUrl').value = this.config.resourcesBaseUrl;
        document.getElementById('theme').value = this.config.theme;
        document.getElementById('mode').value = this.config.mode;

        // Set security checkboxes
        document.getElementById('autoAddCSP').checked = this.config.autoAddCSP;
        document.getElementById('enforceHTTPS').checked = this.config.enforceHTTPS;
        document.getElementById('debugMode').checked = this.config.debug;

        // Toggle ticket ID field based on mode
        this.toggleTicketIdField();
        
        // Update URL status indicators
        this.updateUrlStatusIndicators();
    }

    // Enhanced event binding with security features
    bindEvents() {
        // Configuration form changes
        const formInputs = ['apiKey', 'baseUrlApi', 'baseUrlWs', 'theme', 'mode', 'ticketId', 'resourcesBaseUrl'];
        formInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateConfig());
                element.addEventListener('input', () => this.updateConfig());
            }
        });

        // Security checkboxes
        ['autoAddCSP', 'enforceHTTPS', 'debugMode'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateSecurityConfig());
            }
        });

        // Control buttons
        document.getElementById('initializeWidget').addEventListener('click', () => this.initializeWidget());
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleWidgetTheme());
        document.getElementById('showTickets').addEventListener('click', () => this.showTickets());
        document.getElementById('showChat').addEventListener('click', () => this.showChat());
        document.getElementById('debugWidget').addEventListener('click', () => this.debugWidget());
        document.getElementById('togglePageTheme').addEventListener('click', () => this.togglePageTheme());

        // Security buttons
        document.getElementById('check-security-status').addEventListener('click', () => this.checkSecurityStatus());
        document.getElementById('test-api-connection').addEventListener('click', () => this.testApiConnection());
        document.getElementById('force-https').addEventListener('click', () => this.forceHttps());
        document.getElementById('add-csp-manually').addEventListener('click', () => this.addCSPManually());
        document.getElementById('clear-security-events').addEventListener('click', () => this.clearSecurityEvents());

        // Protocol switchers (development only)
        if (this.environment.isDevelopment) {
            document.getElementById('switchToHttp').addEventListener('click', () => this.switchToHttp());
            document.getElementById('switchToHttps').addEventListener('click', () => this.switchToHttps());
            document.getElementById('resetDefaults').addEventListener('click', () => this.resetToDefaults());
            document.getElementById('simulate-mixed-content').addEventListener('click', () => this.simulateMixedContent());
        }

        // Mode change handler
        document.getElementById('mode').addEventListener('change', () => this.toggleTicketIdField());

        // URL change handlers for real-time validation
        document.getElementById('baseUrlApi').addEventListener('input', () => this.updateUrlStatusIndicators());
        document.getElementById('baseUrlWs').addEventListener('input', () => this.updateUrlStatusIndicators());
    }

    // Update security configuration
    updateSecurityConfig() {
        this.config.autoAddCSP = document.getElementById('autoAddCSP').checked;
        this.config.enforceHTTPS = document.getElementById('enforceHTTPS').checked;
        this.config.debug = document.getElementById('debugMode').checked;
        this.config.isProduction = document.getElementById('isProduction').checked; // Ditambahkan

        this.logSecurityEvent('security_config_updated', {
            autoAddCSP: this.config.autoAddCSP,
            enforceHTTPS: this.config.enforceHTTPS,
            debug: this.config.debug,
            isProduction: this.config.isProduction
        });

        console.log('[Demo] Security config updated:', this.config);
    }

    // Setup security monitoring
    setupSecurityMonitoring() {
        // Listen for widget security events
        window.addEventListener('widget-security-event', (event) => {
            this.logSecurityEvent('widget_security_event', {
                widgetEvent: event.detail
            });
        });

        // Listen for fetch security events
        window.addEventListener('fetch-security-event', (event) => {
            this.logSecurityEvent('fetch_security_event', {
                fetchEvent: event.detail
            });
        });

        // Monitor CSP changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const cspAdded = addedNodes.some(node => 
                        node.nodeType === Node.ELEMENT_NODE && 
                        node.getAttribute && 
                        node.getAttribute('http-equiv') === 'Content-Security-Policy'
                    );
                    
                    if (cspAdded) {
                        this.logSecurityEvent('csp_auto_added', {
                            method: 'dom_mutation_observer',
                            timestamp: new Date().toISOString()
                        });
                        this.updateSecurityStatus();
                    }
                }
            });
        });
        
        observer.observe(document.head, { childList: true });

        console.log('[Demo] Security monitoring setup completed');
    }

    // Update security status display
    updateSecurityStatus() {
        // Page protocol status
        const pageProtocolElement = document.getElementById('page-protocol-status');
        const protocol = window.location.protocol.toUpperCase();
        pageProtocolElement.textContent = protocol;
        pageProtocolElement.className = `text-lg font-semibold ${
            protocol === 'HTTPS:' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
        }`;

        // Secure context status
        const secureContextElement = document.getElementById('secure-context-status');
        const isSecure = this.environment.isSecureContext;
        secureContextElement.textContent = isSecure ? 'Secure' : 'Insecure';
        secureContextElement.className = `text-lg font-semibold ${
            isSecure ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`;

        // CSP status
        const cspElement = document.getElementById('csp-status');
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        const cspContent = cspMeta ? cspMeta.getAttribute('content') : null;
        const hasUpgradeInsecure = cspContent && cspContent.includes('upgrade-insecure-requests');

        if (hasUpgradeInsecure) {
            cspElement.textContent = 'Active';
            cspElement.className = 'text-lg font-semibold text-green-600 dark:text-green-400';
        } else if (cspMeta) {
            cspElement.textContent = 'Present';
            cspElement.className = 'text-lg font-semibold text-amber-600 dark:text-amber-400';
        } else {
            cspElement.textContent = 'None';
            cspElement.className = 'text-lg font-semibold text-red-600 dark:text-red-400';
        }

        // Widget security status
        const widgetSecurityElement = document.getElementById('widget-security-status');
        if (this.isInitialized && this.widget) {
            const securityStatus = this.widget.checkSecurityStatus ? this.widget.checkSecurityStatus() : null;
            if (securityStatus) {
                const isWidgetSecure = securityStatus.isSecureContext && securityStatus.hasCSP;
                widgetSecurityElement.textContent = isWidgetSecure ? 'Secure' : 'Partial';
                widgetSecurityElement.className = `text-lg font-semibold ${
                    isWidgetSecure ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                }`;
            } else {
                widgetSecurityElement.textContent = 'Unknown';
                widgetSecurityElement.className = 'text-lg font-semibold text-gray-600 dark:text-gray-400';
            }
        } else {
            widgetSecurityElement.textContent = 'Not Loaded';
            widgetSecurityElement.className = 'text-lg font-semibold text-gray-600 dark:text-gray-400';
        }
    }

    // Update URL status indicators
    updateUrlStatusIndicators() {
        const apiUrl = document.getElementById('baseUrlApi').value;
        const wsUrl = document.getElementById('baseUrlWs').value;

        // API URL status
        const apiStatusElement = document.getElementById('api-url-status');
        if (apiUrl.startsWith('https://')) {
            apiStatusElement.innerHTML = '<span class="text-xs text-green-600 dark:text-green-400">🔒 Secure</span>';
        } else if (apiUrl.startsWith('http://')) {
            apiStatusElement.innerHTML = '<span class="text-xs text-amber-600 dark:text-amber-400">⚠️ HTTP</span>';
        } else {
            apiStatusElement.innerHTML = '';
        }

        // WebSocket URL status
        const wsStatusElement = document.getElementById('ws-url-status');
        if (wsUrl.startsWith('wss://')) {
            wsStatusElement.innerHTML = '<span class="text-xs text-green-600 dark:text-green-400">🔒 Secure</span>';
        } else if (wsUrl.startsWith('ws://')) {
            wsStatusElement.innerHTML = '<span class="text-xs text-amber-600 dark:text-amber-400">⚠️ WS</span>';
        } else {
            wsStatusElement.innerHTML = '';
        }
    }

    // Update configuration from form with enhanced validation
    updateConfig() {
        const formData = {
            apiKey: document.getElementById('apiKey').value,
            baseUrlApi: document.getElementById('baseUrlApi').value,
            baseUrlWs: document.getElementById('baseUrlWs').value,
            theme: document.getElementById('theme').value,
            mode: document.getElementById('mode').value,
            ticketId: document.getElementById('ticketId').value,
            resourcesBaseUrl: document.getElementById('resourcesBaseUrl').value
        };

        // Validate URLs with security checks
        const originalApiUrl = formData.baseUrlApi;
        const originalWsUrl = formData.baseUrlWs;
        const originalResourcesUrl = formData.resourcesBaseUrl;

        formData.baseUrlApi = this.validateUrl(formData.baseUrlApi, 'api');
        formData.baseUrlWs = this.validateUrl(formData.baseUrlWs, 'ws');
        formData.resourcesBaseUrl = this.validateUrl(formData.resourcesBaseUrl, 'api');

        // Update form values if they were changed by validation
        document.getElementById('baseUrlApi').value = formData.baseUrlApi;
        document.getElementById('baseUrlWs').value = formData.baseUrlWs;
        document.getElementById('resourcesBaseUrl').value = formData.resourcesBaseUrl;

        // Log URL changes
        if (originalApiUrl !== formData.baseUrlApi) {
            this.logSecurityEvent('api_url_auto_corrected', {
                original: originalApiUrl,
                corrected: formData.baseUrlApi
            });
        }

        this.config = { ...this.config, ...formData };
        
        console.log('[Demo] Configuration updated:', this.config);
        this.updateConfigDisplay();
        this.updateUrlStatusIndicators();
    }

    // Enhanced widget initialization with security features
    async initializeWidget() {
        try {
            this.showLoadingOverlay(true);
            this.updateStatus('Loading widget with enhanced security...', 'info');

            // Validate configuration
            if (!this.config.baseUrlApi || !this.config.baseUrlWs) {
                throw new Error('API URL and WebSocket URL are required');
            }

            // Destroy existing widget if any
            if (this.isInitialized && this.widget) {
                console.log('[Demo] Destroying existing widget...');
                if (typeof this.widget.destroy === 'function') {
                    this.widget.destroy();
                }
                this.widget = null;
                this.isInitialized = false;
            }

            // Set global configuration
            window.WIDGET_CONFIG = {
                apiKey: this.config.apiKey,
                baseUrlApi: this.config.baseUrlApi,
                baseUrlWs: this.config.baseUrlWs,
                isProduction: !this.environment.isDevelopment
            };

            console.log('[Demo] Global config set:', window.WIDGET_CONFIG);

            // Load resources
            await this.loadCSS();
            await this.loadJS();

            // Wait a bit for scripts to fully load
            await new Promise(resolve => setTimeout(resolve, 300));

            // Prepare enhanced widget configuration
            const widgetConfig = {
                apiKey: this.config.apiKey,
                baseUrlApi: this.config.baseUrlApi,
                baseUrlWs: this.config.baseUrlWs,
                containerId: 'embedded-chat-widget-container',
                theme: this.config.theme,
                mode: this.config.mode,
                height: '600px',
                // Enhanced security options
                autoAddCSP: this.config.autoAddCSP,
                enforceHTTPS: this.config.enforceHTTPS,
                debug: this.config.debug,
                onSecurityEvent: (event) => {
                    this.logSecurityEvent('widget_security_callback', event);
                }
            };

            // Add chat-only specific config
            if (this.config.mode === 'chat-only' && this.config.ticketId) {
                widgetConfig.chatOnly = {
                    ticketId: this.config.ticketId,
                    hideTicketInfo: false,
                    hideActions: false,
                    autoConnect: true
                };
            }

            console.log('[Demo] Enhanced widget config:', widgetConfig);

            // Initialize widget with enhanced security
            if (typeof window.CappuccinoChatEmbeddedWidget === 'function') {
                console.log('[Demo] Initializing CappuccinoChatEmbeddedWidget with enhanced security...');
                this.widget = window.CappuccinoChatEmbeddedWidget(widgetConfig);
                
                this.isInitialized = true;
                this.currentTheme = this.config.theme;

                // Update container styling
                const container = document.getElementById('embedded-chat-widget-container');
                container.classList.add('widget-loaded');
                container.innerHTML = ''; // Clear placeholder content

                // Enable control buttons
                this.updateControlButtons(true);
                
                this.updateStatus('Widget initialized successfully with enhanced security!', 'success');
                this.showToast('✅ Widget initialized with enhanced security!', 'success');
                
                // Log successful initialization
                this.logSecurityEvent('widget_initialized', {
                    config: widgetConfig,
                    securityFeatures: {
                        autoAddCSP: this.config.autoAddCSP,
                        enforceHTTPS: this.config.enforceHTTPS,
                        debug: this.config.debug
                    }
                });

                // Update security status after initialization
                setTimeout(() => {
                    this.updateSecurityStatus();
                }, 500);
                
                console.log('[Demo] Enhanced widget initialized successfully');
                
            } else {
                throw new Error('CappuccinoChatEmbeddedWidget function not found. Make sure the enhanced widget library is loaded correctly.');
            }

        } catch (error) {
            console.error('[Demo] Error initializing widget:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
            this.showToast(`❌ Failed to initialize widget: ${error.message}`, 'error');
            
            this.logSecurityEvent('widget_initialization_failed', {
                error: error.message,
                stack: error.stack
            });
            
            // Reset container
            const container = document.getElementById('embedded-chat-widget-container');
            container.classList.remove('widget-loaded');
            container.innerHTML = `
                <div class="text-center text-gray-500 dark:text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <p class="text-lg font-medium">Widget Failed to Load</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `;
            
        } finally {
            this.showLoadingOverlay(false);
            this.updateConfigDisplay();
            this.updateDebugInfo();
        }
    }

    // Enhanced security check
    async checkSecurityStatus() {
        console.log('[Demo] Checking comprehensive security status...');
        
        try {
            const securityStatus = {
                pageContext: {
                    protocol: window.location.protocol,
                    isSecureContext: window.isSecureContext,
                    hostname: window.location.hostname
                },
                csp: {
                    metaTag: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
                    content: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content'),
                    hasUpgradeInsecure: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content')?.includes('upgrade-insecure-requests')
                },
                widget: this.isInitialized && this.widget && this.widget.checkSecurityStatus ? 
                    this.widget.checkSecurityStatus() : null,
                urls: {
                    api: {
                        url: this.config.baseUrlApi,
                        isSecure: this.config.baseUrlApi.startsWith('https://')
                    },
                    websocket: {
                        url: this.config.baseUrlWs,
                        isSecure: this.config.baseUrlWs.startsWith('wss://')
                    }
                },
                timestamp: new Date().toISOString()
            };

            console.log('[Demo] Security status:', securityStatus);
            
            this.logSecurityEvent('security_status_check', securityStatus);
            this.updateSecurityStatus();
            
            this.showToast('🔍 Security status checked - see debug panel', 'info');
            
            return securityStatus;
            
        } catch (error) {
            console.error('[Demo] Error checking security status:', error);
            this.showToast('❌ Error checking security status', 'error');
            throw error;
        }
    }

    // Test API connection with security analysis
    async testApiConnection() {
        if (!this.config.baseUrlApi) {
            this.showToast('⚠️ No API URL configured', 'warning');
            return;
        }

        console.log('[Demo] Testing secure connection to:', this.config.baseUrlApi);
        this.updateStatus('Testing API connection security...', 'info');

        try {
            // Use enhanced fetch service if available
            if (window.CappuccinoSecurityHelpers && window.CappuccinoSecurityHelpers.testSecureConnection) {
                const result = await window.CappuccinoSecurityHelpers.testSecureConnection(this.config.baseUrlApi);
                
                console.log('[Demo] Connection test result:', result);
                
                this.logSecurityEvent('api_connection_test', {
                    url: this.config.baseUrlApi,
                    result: result
                });
                
                const status = result.success ? 'success' : 'error';
                const message = result.success ? 
                    `✅ API connection secure: ${this.config.baseUrlApi}` :
                    `❌ API connection failed: ${result.error}`;
                
                this.updateStatus(message, status);
                this.showToast(message, status);
                
                if (result.recommendations && result.recommendations.length > 0) {
                    console.log('[Demo] Security recommendations:', result.recommendations);
                    this.showToast(`💡 Recommendations: ${result.recommendations.slice(0, 2).join(', ')}`, 'info', 5000);
                }
                
            } else {
                // Fallback basic test
                const response = await fetch(this.config.baseUrlApi, { 
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                
                this.logSecurityEvent('basic_connection_test', {
                    url: this.config.baseUrlApi,
                    success: true
                });
                
                this.updateStatus('✅ Basic connection test passed', 'success');
                this.showToast('✅ Basic connection test passed', 'success');
            }
            
        } catch (error) {
            console.error('[Demo] Connection test failed:', error);
            
            this.logSecurityEvent('connection_test_failed', {
                url: this.config.baseUrlApi,
                error: error.message
            });
            
            this.updateStatus(`❌ Connection test failed: ${error.message}`, 'error');
            this.showToast(`❌ Connection test failed: ${error.message}`, 'error');
        }
    }

    // Force HTTPS on all URLs
    forceHttps() {
        console.log('[Demo] Forcing HTTPS on all URLs...');
        
        let changesMade = false;
        
        // Force API URL to HTTPS
        if (this.config.baseUrlApi.startsWith('http://')) {
            const oldUrl = this.config.baseUrlApi;
            this.config.baseUrlApi = this.config.baseUrlApi.replace('http://', 'https://');
            document.getElementById('baseUrlApi').value = this.config.baseUrlApi;
            
            this.logSecurityEvent('manual_https_upgrade', {
                type: 'api',
                from: oldUrl,
                to: this.config.baseUrlApi
            });
            
            changesMade = true;
        }

        // Force WebSocket URL to WSS
        if (this.config.baseUrlWs.startsWith('ws://')) {
            const oldUrl = this.config.baseUrlWs;
            this.config.baseUrlWs = this.config.baseUrlWs.replace('ws://', 'wss://');
            document.getElementById('baseUrlWs').value = this.config.baseUrlWs;
            
            this.logSecurityEvent('manual_wss_upgrade', {
                type: 'websocket',
                from: oldUrl,
                to: this.config.baseUrlWs
            });
            
            changesMade = true;
        }

        // Force Resources URL to HTTPS
        if (this.config.resourcesBaseUrl.startsWith('http://')) {
            const oldUrl = this.config.resourcesBaseUrl;
            this.config.resourcesBaseUrl = this.config.resourcesBaseUrl.replace('http://', 'https://');
            document.getElementById('resourcesBaseUrl').value = this.config.resourcesBaseUrl;
            
            this.logSecurityEvent('manual_resources_upgrade', {
                type: 'resources',
                from: oldUrl,
                to: this.config.resourcesBaseUrl
            });
            
            changesMade = true;
        }

        if (changesMade) {
            this.updateUrlStatusIndicators();
            this.showToast('🔒 All URLs upgraded to secure protocols', 'success');
            console.log('[Demo] HTTPS enforcement completed');
        } else {
            this.showToast('✅ All URLs already use secure protocols', 'info');
        }

        // Also force HTTPS on widget if initialized
        if (this.isInitialized && this.widget && typeof this.widget.forceHTTPS === 'function') {
            this.widget.forceHTTPS();
            this.logSecurityEvent('widget_https_forced', {
                timestamp: new Date().toISOString()
            });
        }
    }

    // Manually add CSP meta tag
    addCSPManually() {
        console.log('[Demo] Manually adding CSP meta tag...');
        
        try {
            // Check if CSP already exists
            const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            
            if (!existingCSP) {
                const metaCSP = document.createElement('meta');
                metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
                metaCSP.setAttribute('content', 'upgrade-insecure-requests');
                document.head.appendChild(metaCSP);
                
                this.logSecurityEvent('manual_csp_added', {
                    content: 'upgrade-insecure-requests',
                    method: 'manual'
                });
                
                this.updateSecurityStatus();
                this.showToast('🛡️ CSP meta tag added manually', 'success');
                console.log('[Demo] CSP meta tag added successfully');
                
            } else {
                const content = existingCSP.getAttribute('content') || '';
                if (!content.includes('upgrade-insecure-requests')) {
                    const newContent = content ? `${content}; upgrade-insecure-requests` : 'upgrade-insecure-requests';
                    existingCSP.setAttribute('content', newContent);
                    
                    this.logSecurityEvent('manual_csp_updated', {
                        oldContent: content,
                        newContent: newContent
                    });
                    
                    this.updateSecurityStatus();
                    this.showToast('🛡️ CSP meta tag updated', 'success');
                } else {
                    this.showToast('✅ CSP already includes upgrade-insecure-requests', 'info');
                }
            }
            
        } catch (error) {
            console.error('[Demo] Error adding CSP meta tag:', error);
            this.showToast('❌ Error adding CSP meta tag', 'error');
        }
    }

    // Simulate mixed content for testing
    simulateMixedContent() {
        console.log('[Demo] Simulating mixed content scenario...');
        
        // Temporarily set HTTP URLs to simulate mixed content
        const originalApiUrl = this.config.baseUrlApi;
        const originalWsUrl = this.config.baseUrlWs;
        
        document.getElementById('baseUrlApi').value = this.config.baseUrlApi.replace('https://', 'http://');
        document.getElementById('baseUrlWs').value = this.config.baseUrlWs.replace('wss://', 'ws://');
        
        this.logSecurityEvent('mixed_content_simulation', {
            originalApiUrl,
            originalWsUrl,
            simulatedApiUrl: document.getElementById('baseUrlApi').value,
            simulatedWsUrl: document.getElementById('baseUrlWs').value
        });
        
        this.updateConfig();
        this.showToast('⚠️ Mixed content simulation activated - URLs changed to HTTP', 'warning');
        
        // Auto-revert after 10 seconds
        setTimeout(() => {
            document.getElementById('baseUrlApi').value = originalApiUrl;
            document.getElementById('baseUrlWs').value = originalWsUrl;
            this.updateConfig();
            this.showToast('🔄 Mixed content simulation ended - URLs restored', 'info');
        }, 10000);
    }

    // Clear security events
    clearSecurityEvents() {
        this.securityEvents = [];
        this.updateSecurityEventsDisplay();
        this.showToast('🗑️ Security events cleared', 'info');
        console.log('[Demo] Security events cleared');
    }

    // Update security events display
    updateSecurityEventsDisplay() {
        const eventsList = document.getElementById('security-events-list');
        
        if (this.securityEvents.length === 0) {
            eventsList.innerHTML = '<div class="text-gray-500 dark:text-gray-400 text-sm">No security events recorded yet</div>';
            return;
        }

        // Show last 10 events
        const recentEvents = this.securityEvents.slice(-10).reverse();
        
        eventsList.innerHTML = recentEvents.map(event => {
            const time = new Date(event.timestamp).toLocaleTimeString();
            const typeColors = {
                'demo_initialized': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                'widget_initialized': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                'security_status_check': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
                'url_auto_upgrade': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
                'manual_https_upgrade': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                'csp_auto_added': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            };
            
            const typeClass = typeColors[event.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            
            return `
                <div class="flex items-start space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded">
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">${time}</span>
                    <span class="px-2 py-1 text-xs font-medium rounded ${typeClass}">${event.type}</span>
                    <div class="flex-1 text-xs text-gray-600 dark:text-gray-400">
                        ${JSON.stringify(event.data, null, 0).substring(0, 100)}${JSON.stringify(event.data).length > 100 ? '...' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Debug widget with enhanced information
    debugWidget() {
        if (!this.isInitialized || !this.widget) {
            this.showToast('⚠️ Widget not initialized', 'warning');
            return;
        }

        console.log('=== ENHANCED WIDGET DEBUG ===');
        
        try {
            // Debug widget state
            if (typeof this.widget.getState === 'function') {
                const state = this.widget.getState();
                console.log('Widget State:', state);
            }

            // Debug widget security
            if (typeof this.widget.debugSecurity === 'function') {
                const security = this.widget.debugSecurity();
                console.log('Widget Security Debug:', security);
            } else if (typeof this.widget.checkSecurityStatus === 'function') {
                const security = this.widget.checkSecurityStatus();
                console.log('Widget Security Status:', security);
            }

            // Debug theme
            if (typeof this.widget.debugTheme === 'function') {
                const theme = this.widget.debugTheme();
                console.log('Widget Theme Debug:', theme);
            }

            console.log('Demo State:', {
                config: this.config,
                environment: this.environment,
                securityEvents: this.securityEvents.length,
                isInitialized: this.isInitialized
            });

            console.log('Security Events:', this.securityEvents);
            console.log('==============================');

            this.showToast('🐛 Debug information logged to console', 'info');

        } catch (error) {
            console.error('Error during debug:', error);
            this.showToast('❌ Error during debug', 'error');
        }
    }

    // Enhanced load CSS with security validation
    async loadCSS() {
        return new Promise((resolve, reject) => {
            const linkId = 'embedded-widget-css';
            
            // Remove existing if any
            const existingLink = document.getElementById(linkId);
            if (existingLink) {
                existingLink.remove();
            }

            // Create new link element
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `${this.config.resourcesBaseUrl}/css/cappuccino-chat-embedded.css`;

            console.log('[Demo] Loading CSS:', link.href);

            link.onload = () => {
                console.log('[Demo] CSS loaded successfully');
                this.logSecurityEvent('css_loaded', {
                    url: link.href,
                    isSecure: link.href.startsWith('https://')
                });
                resolve();
            };
            
            link.onerror = (error) => {
                console.error('[Demo] Failed to load CSS:', link.href, error);
                this.logSecurityEvent('css_load_failed', {
                    url: link.href,
                    error: error.toString()
                });
                reject(new Error('Failed to load widget CSS'));
            };

            document.head.appendChild(link);
        });
    }

    // Enhanced load JavaScript with security validation
    async loadJS() {
        return new Promise((resolve, reject) => {
            const scriptId = 'embedded-widget-js';
            
            // Remove existing if any
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }

            // Create new script element
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `${this.config.resourcesBaseUrl}/js/cappuccino-chat-embedded.umd.js`;

            console.log('[Demo] Loading JS:', script.src);

            script.onload = () => {
                console.log('[Demo] JS loaded successfully');
                this.logSecurityEvent('js_loaded', {
                    url: script.src,
                    isSecure: script.src.startsWith('https://'),
                    hasSecurityHelpers: !!window.CappuccinoSecurityHelpers
                });
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('[Demo] Failed to load JS:', script.src, error);
                this.logSecurityEvent('js_load_failed', {
                    url: script.src,
                    error: error.toString()
                });
                reject(new Error('Failed to load widget JavaScript'));
            };

            document.body.appendChild(script);
        });
    }

    // [Keep all other existing methods like toggleWidgetTheme, showTickets, etc. but enhance them with logging]
    
    toggleWidgetTheme() {
        if (this.isInitialized && this.widget) {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            
            if (typeof this.widget.setTheme === 'function') {
                this.widget.setTheme(newTheme);
                this.currentTheme = newTheme;
                
                document.getElementById('theme').value = newTheme;
                this.config.theme = newTheme;
                
                this.logSecurityEvent('widget_theme_changed', {
                    from: this.currentTheme === 'light' ? 'dark' : 'light',
                    to: newTheme
                });
                
                this.showToast(`🎨 Widget theme changed to ${newTheme}`, 'info');
                console.log('[Demo] Widget theme toggled to:', newTheme);
            }
        }
    }

    showTickets() {
        if (this.isInitialized && this.widget && typeof this.widget.showTickets === 'function') {
            this.widget.showTickets();
            this.logSecurityEvent('widget_view_changed', { view: 'tickets' });
            this.showToast('📋 Showing tickets view', 'info');
        }
    }

    showChat() {
        if (this.isInitialized && this.widget && typeof this.widget.showChat === 'function') {
            this.widget.showChat();
            this.logSecurityEvent('widget_view_changed', { view: 'chat' });
            this.showToast('💬 Showing chat view', 'info');
        }
    }

    // [Include all other existing methods with enhanced logging and security context]
    // ... (keeping existing methods but adding security logging where appropriate)

    // Protocol switchers with enhanced logging
    switchToHttp() {
        if (this.environment.isDevelopment) {
            const changes = [];
            
            const apiInput = document.getElementById('baseUrlApi');
            const wsInput = document.getElementById('baseUrlWs');
            const resourcesInput = document.getElementById('resourcesBaseUrl');
            
            if (apiInput.value.startsWith('https://')) {
                changes.push({ type: 'api', from: apiInput.value, to: apiInput.value.replace('https://', 'http://') });
                apiInput.value = apiInput.value.replace('https://', 'http://');
            }
            
            if (wsInput.value.startsWith('wss://')) {
                changes.push({ type: 'websocket', from: wsInput.value, to: wsInput.value.replace('wss://', 'ws://') });
                wsInput.value = wsInput.value.replace('wss://', 'ws://');
            }
            
            if (resourcesInput.value.startsWith('https://')) {
                changes.push({ type: 'resources', from: resourcesInput.value, to: resourcesInput.value.replace('https://', 'http://') });
                resourcesInput.value = resourcesInput.value.replace('https://', 'http://');
            }
            
            this.updateConfig();
            
            if (changes.length > 0) {
                this.logSecurityEvent('protocol_switched_to_http', {
                    changes: changes,
                    environment: 'development'
                });
                this.showToast('⚠️ URLs switched to HTTP/WS protocols (development only)', 'warning');
            }
        }
    }

    switchToHttps() {
        const changes = [];
        
        const apiInput = document.getElementById('baseUrlApi');
        const wsInput = document.getElementById('baseUrlWs');
        const resourcesInput = document.getElementById('resourcesBaseUrl');
        
        if (apiInput.value.startsWith('http://')) {
            changes.push({ type: 'api', from: apiInput.value, to: apiInput.value.replace('http://', 'https://') });
            apiInput.value = apiInput.value.replace('http://', 'https://');
        }
        
        if (wsInput.value.startsWith('ws://')) {
            changes.push({ type: 'websocket', from: wsInput.value, to: wsInput.value.replace('ws://', 'wss://') });
            wsInput.value = wsInput.value.replace('ws://', 'wss://');
        }
        
        if (resourcesInput.value.startsWith('http://')) {
            changes.push({ type: 'resources', from: resourcesInput.value, to: resourcesInput.value.replace('http://', 'https://') });
            resourcesInput.value = resourcesInput.value.replace('http://', 'https://');
        }
        
        this.updateConfig();
        
        if (changes.length > 0) {
            this.logSecurityEvent('protocol_switched_to_https', {
                changes: changes
            });
            this.showToast('🔒 URLs switched to HTTPS/WSS protocols', 'success');
        }
    }

    resetToDefaults() {
        const defaults = this.getSmartDefaultUrls();
        
        document.getElementById('baseUrlApi').value = defaults.api;
        document.getElementById('baseUrlWs').value = defaults.ws;
        document.getElementById('resourcesBaseUrl').value = defaults.resources;
        
        this.logSecurityEvent('urls_reset_to_defaults', {
            defaults: defaults,
            environment: this.environment
        });
        
        this.updateConfig();
        this.showToast('🔄 URLs reset to environment defaults', 'info');
    }

    toggleTicketIdField() {
        const mode = document.getElementById('mode').value;
        const ticketIdContainer = document.getElementById('ticketIdContainer');
        
        if (mode === 'chat-only') {
            ticketIdContainer.classList.remove('hidden');
        } else {
            ticketIdContainer.classList.add('hidden');
        }
    }

    loadFormValues() {
        Object.keys(this.config).forEach(key => {
            const element = document.getElementById(key);
            if (element && this.config[key]) {
                element.value = this.config[key];
            }
        });
    }

    updateEnvironmentInfo() {
        const envInfo = document.getElementById('environment-info');
        const envDetails = document.getElementById('env-details');
        
        envInfo.classList.remove('hidden');
        
        const envClass = this.environment.isDevelopment ? 
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
        envInfo.className = `mb-6 p-4 rounded-lg border ${envClass}`;
        
        envDetails.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                    <strong>Environment:</strong><br>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${this.environment.isDevelopment ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}">
                        ${this.environment.isDevelopment ? 'Development' : 'Production'}
                    </span>
                </div>
                <div>
                    <strong>Protocol:</strong><br>
                    <span class="protocol-indicator protocol-${this.environment.isHttps ? 'https' : 'http'}">${this.environment.protocol.toUpperCase()}</span>
                </div>
                <div>
                    <strong>Hostname:</strong><br>
                    <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">${this.environment.hostname}</code>
                </div>
                <div>
                    <strong>Secure Context:</strong><br>
                    <span class="text-xs font-medium ${this.environment.isSecureContext ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                        ${this.environment.isSecureContext ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <strong>Recommended:</strong><br>
                    <span class="text-xs font-medium">${this.environment.recommended}</span>
                </div>
            </div>
        `;
    }

    updateControlButtons(enabled) {
        const buttons = ['toggleTheme', 'showTickets', 'showChat', 'debugWidget'];
        buttons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = !enabled;
            }
        });

        const initButton = document.getElementById('initializeWidget');
        if (initButton) {
            initButton.innerHTML = enabled ? 
                '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Reload Widget</span>' :
                '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path></svg>Initialize Widget</span>';
        }
    }

    updateStatus(message, type = 'info') {
        const statusDisplay = document.getElementById('statusDisplay');
        const statusContent = document.getElementById('statusContent');
        
        const typeClasses = {
            success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-400',
            error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-400',
            warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-400',
            info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-400'
        };

        statusDisplay.className = `p-3 rounded-lg text-sm border ${typeClasses[type]}`;
        statusContent.textContent = message;
        statusDisplay.classList.remove('hidden');

        setTimeout(() => {
            statusDisplay.classList.add('hidden');
        }, 10000);
    }

    updateConfigDisplay() {
        const configDisplay = document.getElementById('configDisplay');
        const configJson = document.getElementById('configJson');
        
        if (this.isInitialized) {
            configDisplay.classList.remove('hidden');
            configJson.textContent = JSON.stringify(this.config, null, 2);
        } else {
            configDisplay.classList.add('hidden');
        }
    }

    updateDebugInfo() {
        const debugInfo = document.getElementById('debugInfo');
        const debugContent = document.getElementById('debugContent');
        
        if (this.isInitialized) {
            debugInfo.classList.remove('hidden');
            
            const debugData = {
                environment: this.environment,
                widgetState: {
                    initialized: this.isInitialized,
                    hasInstance: !!this.widget,
                    currentTheme: this.currentTheme,
                    securityStatus: this.widget && this.widget.checkSecurityStatus ? 
                        this.widget.checkSecurityStatus() : null
                },
                globalConfig: window.WIDGET_CONFIG,
                resourceUrls: {
                    css: `${this.config.resourcesBaseUrl}/css/cappuccino-chat-embedded.css`,
                    js: `${this.config.resourcesBaseUrl}/js/cappuccino-chat-embedded.umd.js`
                },
                securityEvents: {
                    total: this.securityEvents.length,
                    recent: this.securityEvents.slice(-5)
                },
                widgetMethods: this.widget ? Object.getOwnPropertyNames(this.widget).filter(prop => typeof this.widget[prop] === 'function') : [],
                securityHelpers: !!window.CappuccinoSecurityHelpers
            };
            
            debugContent.innerHTML = `
                <div class="debug-panel bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <pre class="text-xs">${JSON.stringify(debugData, null, 2)}</pre>
                </div>
            `;
        } else {
            debugInfo.classList.add('hidden');
        }
    }

    showLoadingOverlay(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${icons[type]}</span>
                <span>${message}</span>
                <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);
    }

    togglePageTheme() {
        this.currentPageTheme = this.currentPageTheme === 'light' ? 'dark' : 'light';
        
        if (this.currentPageTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        this.logSecurityEvent('page_theme_changed', {
            theme: this.currentPageTheme
        });
        
        this.showToast(`🎨 Page theme changed to ${this.currentPageTheme}`, 'info');
    }
}

// Initialize enhanced demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Demo] DOM loaded, initializing enhanced demo...');
    window.cappuccinoChatDemo = new EnhancedCappuccinoChatDemo();
    
    // Make demo available globally for debugging
    if (window.cappuccinoChatDemo.environment.isDevelopment) {
        window.debugDemo = () => {
            console.log('=== ENHANCED DEMO DEBUG ===');
            console.log('Demo instance:', window.cappuccinoChatDemo);
            console.log('Environment:', window.cappuccinoChatDemo.environment);
            console.log('Configuration:', window.cappuccinoChatDemo.config);
            console.log('Widget instance:', window.cappuccinoChatDemo.widget);
            console.log('Global WIDGET_CONFIG:', window.WIDGET_CONFIG);
            console.log('Security Events:', window.cappuccinoChatDemo.securityEvents);
            console.log('Security Helpers Available:', !!window.CappuccinoSecurityHelpers);
            console.log('============================');
        };
        
        console.log('[Demo] Development mode - enhanced debug function available: window.debugDemo()');
    }
});