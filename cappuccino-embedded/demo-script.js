// demo-script.js - Main JavaScript untuk Cappuccino Chat Widget Demo

class CappuccinoChatDemo {
    constructor() {
        this.widget = null;
        this.isInitialized = false;
        this.currentTheme = 'light';
        this.currentPageTheme = 'light';
        
        // Configuration
        this.config = {
            apiKey: '',
            baseUrlApi: '',
            baseUrlWs: '',
            agentName: 'Support Agent',
            theme: 'light',
            mode: 'full',
            ticketId: '',
            resourcesBaseUrl: ''
        };

        // Environment detection
        this.environment = this.detectEnvironment();
        
        // Initialize demo
        this.init();
    }

    // Environment detection
    detectEnvironment() {
        const isHttps = window.location.protocol === 'https:';
        const isDevelopment = 
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('.local') ||
            window.location.port !== '';

        return {
            isHttps,
            isDevelopment,
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            recommended: isDevelopment && !isHttps ? 'HTTP/WS' : 'HTTPS/WSS'
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

    // Validate and fix URLs based on environment
    validateUrl(url, type) {
        if (!url) return url;

        // Untuk development localhost, biarkan user pilih protokol
        if (this.environment.isDevelopment && !this.environment.isHttps) {
            return url;
        }

        // Untuk production atau HTTPS page, enforce secure protocols
        if (type === 'api' && url.startsWith('http://')) {
            const httpsUrl = url.replace('http://', 'https://');
            this.showToast('URL converted to HTTPS for security', 'warning');
            console.warn('[Demo] Converted HTTP to HTTPS:', url, '→', httpsUrl);
            return httpsUrl;
        }

        if (type === 'ws' && url.startsWith('ws://')) {
            const wssUrl = url.replace('ws://', 'wss://');
            this.showToast('WebSocket URL converted to WSS for security', 'warning');
            console.warn('[Demo] Converted WS to WSS:', url, '→', wssUrl);
            return wssUrl;
        }

        return url;
    }

    // Initialize demo
    init() {
        console.log('[Demo] Initializing demo...', this.environment);
        
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

        // Show protocol switcher in development
        if (this.environment.isDevelopment) {
            document.getElementById('protocolSwitcher').classList.remove('hidden');
        }

        console.log('[Demo] Demo initialized successfully');
    }

    // Setup UI elements
    setupUI() {
        // Set initial form values
        document.getElementById('baseUrlApi').value = this.config.baseUrlApi;
        document.getElementById('baseUrlWs').value = this.config.baseUrlWs;
        document.getElementById('resourcesBaseUrl').value = this.config.resourcesBaseUrl;
        document.getElementById('agentName').value = this.config.agentName;
        document.getElementById('theme').value = this.config.theme;
        document.getElementById('mode').value = this.config.mode;

        // Toggle ticket ID field based on mode
        this.toggleTicketIdField();
    }

    // Bind event listeners
    bindEvents() {
        // Configuration form changes
        const formInputs = ['apiKey', 'baseUrlApi', 'baseUrlWs', 'agentName', 'theme', 'mode', 'ticketId', 'resourcesBaseUrl'];
        formInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateConfig());
                element.addEventListener('input', () => this.updateConfig());
            }
        });

        // Control buttons
        document.getElementById('initializeWidget').addEventListener('click', () => this.initializeWidget());
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleWidgetTheme());
        document.getElementById('showTickets').addEventListener('click', () => this.showTickets());
        document.getElementById('showChat').addEventListener('click', () => this.showChat());
        document.getElementById('togglePageTheme').addEventListener('click', () => this.togglePageTheme());

        // Protocol switchers (development only)
        if (this.environment.isDevelopment) {
            document.getElementById('switchToHttp').addEventListener('click', () => this.switchToHttp());
            document.getElementById('switchToHttps').addEventListener('click', () => this.switchToHttps());
            document.getElementById('resetDefaults').addEventListener('click', () => this.resetToDefaults());
        }

        // Mode change handler
        document.getElementById('mode').addEventListener('change', () => this.toggleTicketIdField());
    }

    // Update configuration from form
    updateConfig() {
        const formData = {
            apiKey: document.getElementById('apiKey').value,
            baseUrlApi: document.getElementById('baseUrlApi').value,
            baseUrlWs: document.getElementById('baseUrlWs').value,
            agentName: document.getElementById('agentName').value,
            theme: document.getElementById('theme').value,
            mode: document.getElementById('mode').value,
            ticketId: document.getElementById('ticketId').value,
            resourcesBaseUrl: document.getElementById('resourcesBaseUrl').value
        };

        // Validate URLs
        formData.baseUrlApi = this.validateUrl(formData.baseUrlApi, 'api');
        formData.baseUrlWs = this.validateUrl(formData.baseUrlWs, 'ws');
        formData.resourcesBaseUrl = this.validateUrl(formData.resourcesBaseUrl, 'api');

        // Update form values if they were changed by validation
        document.getElementById('baseUrlApi').value = formData.baseUrlApi;
        document.getElementById('baseUrlWs').value = formData.baseUrlWs;
        document.getElementById('resourcesBaseUrl').value = formData.resourcesBaseUrl;

        this.config = { ...this.config, ...formData };
        
        console.log('[Demo] Configuration updated:', this.config);
        this.updateConfigDisplay();
    }

    // Toggle ticket ID field visibility
    toggleTicketIdField() {
        const mode = document.getElementById('mode').value;
        const ticketIdContainer = document.getElementById('ticketIdContainer');
        
        if (mode === 'chat-only') {
            ticketIdContainer.classList.remove('hidden');
        } else {
            ticketIdContainer.classList.add('hidden');
        }
    }

    // Load form values from config
    loadFormValues() {
        Object.keys(this.config).forEach(key => {
            const element = document.getElementById(key);
            if (element && this.config[key]) {
                element.value = this.config[key];
            }
        });
    }

    // Update environment info display
    updateEnvironmentInfo() {
        const envInfo = document.getElementById('environment-info');
        const envDetails = document.getElementById('env-details');
        
        envInfo.classList.remove('hidden');
        
        const envClass = this.environment.isDevelopment ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
        envInfo.className = `mb-6 p-4 rounded-lg border ${envClass}`;
        
        envDetails.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                    <strong>Recommended:</strong><br>
                    <span class="text-xs font-medium">${this.environment.recommended}</span>
                </div>
            </div>
        `;
    }

    // Load CSS dynamically
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
            link.href = `cappuccino-chat-embedded.css`;

            console.log('[Demo] Loading CSS:', link.href);

            link.onload = () => {
                console.log('[Demo] CSS loaded successfully');
                resolve();
            };
            
            link.onerror = (error) => {
                console.error('[Demo] Failed to load CSS:', link.href, error);
                reject(new Error('Failed to load widget CSS'));
            };

            document.head.appendChild(link);
        });
    }

    // Load JavaScript dynamically
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
            script.src = `cappuccino-chat-embedded.umd.js`;

            console.log('[Demo] Loading JS:', script.src);

            script.onload = () => {
                console.log('[Demo] JS loaded successfully');
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('[Demo] Failed to load JS:', script.src, error);
                reject(new Error('Failed to load widget JavaScript'));
            };

            document.body.appendChild(script);
        });
    }

    // Initialize widget
    async initializeWidget() {
        try {
            this.showLoadingOverlay(true);
            this.updateStatus('Loading widget resources...', 'info');

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
                baseUrlWs: this.config.baseUrlWs
            };

            console.log('[Demo] Global config set:', window.WIDGET_CONFIG);

            // Load resources
            await this.loadCSS();
            await this.loadJS();

            // Wait a bit for scripts to fully load
            await new Promise(resolve => setTimeout(resolve, 200));

            // Prepare widget configuration
            const widgetConfig = {
                apiKey: this.config.apiKey,
                baseUrlApi: this.config.baseUrlApi,
                baseUrlWs: this.config.baseUrlWs,
                containerId: 'embedded-chat-widget-container',
                agentName: this.config.agentName,
                theme: this.config.theme,
                mode: this.config.mode,
                height: '600px',
                debug: true
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

            console.log('[Demo] Widget config:', widgetConfig);

            // Initialize widget
            if (typeof window.CappuccinoChatEmbeddedWidget === 'function') {
                console.log('[Demo] Initializing CappuccinoChatEmbeddedWidget...');
                this.widget = window.CappuccinoChatEmbeddedWidget(widgetConfig);
                
                this.isInitialized = true;
                this.currentTheme = this.config.theme;

                // Update container styling
                const container = document.getElementById('embedded-chat-widget-container');
                container.classList.add('widget-loaded');
                container.innerHTML = ''; // Clear placeholder content

                // Enable control buttons
                this.updateControlButtons(true);
                
                this.updateStatus('Widget initialized successfully!', 'success');
                this.showToast('Widget initialized successfully!', 'success');
                
                console.log('[Demo] Widget initialized successfully');
                
            } else {
                throw new Error('CappuccinoChatEmbeddedWidget function not found. Make sure the widget library is loaded correctly.');
            }

        } catch (error) {
            console.error('[Demo] Error initializing widget:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
            this.showToast(`Failed to initialize widget: ${error.message}`, 'error');
            
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

    // Toggle widget theme
    toggleWidgetTheme() {
        if (this.isInitialized && this.widget) {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            
            if (typeof this.widget.setTheme === 'function') {
                this.widget.setTheme(newTheme);
                this.currentTheme = newTheme;
                
                // Update form
                document.getElementById('theme').value = newTheme;
                this.config.theme = newTheme;
                
                this.showToast(`Widget theme changed to ${newTheme}`, 'info');
                console.log('[Demo] Widget theme toggled to:', newTheme);
            }
        }
    }

    // Show tickets view
    showTickets() {
        if (this.isInitialized && this.widget && typeof this.widget.showTickets === 'function') {
            this.widget.showTickets();
            this.showToast('Showing tickets view', 'info');
        }
    }

    // Show chat view
    showChat() {
        if (this.isInitialized && this.widget && typeof this.widget.showChat === 'function') {
            this.widget.showChat();
            this.showToast('Showing chat view', 'info');
        }
    }

    // Toggle page theme (demo page itself)
    togglePageTheme() {
        this.currentPageTheme = this.currentPageTheme === 'light' ? 'dark' : 'light';
        
        if (this.currentPageTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        this.showToast(`Page theme changed to ${this.currentPageTheme}`, 'info');
    }

    // Protocol switchers (development only)
    switchToHttp() {
        if (this.environment.isDevelopment) {
            document.getElementById('baseUrlApi').value = document.getElementById('baseUrlApi').value.replace('https://', 'http://');
            document.getElementById('baseUrlWs').value = document.getElementById('baseUrlWs').value.replace('wss://', 'ws://');
            document.getElementById('resourcesBaseUrl').value = document.getElementById('resourcesBaseUrl').value.replace('https://', 'http://');
            this.updateConfig();
            this.showToast('URLs switched to HTTP/WS protocols', 'info');
        }
    }

    switchToHttps() {
        document.getElementById('baseUrlApi').value = document.getElementById('baseUrlApi').value.replace('http://', 'https://');
        document.getElementById('baseUrlWs').value = document.getElementById('baseUrlWs').value.replace('ws://', 'wss://');
        document.getElementById('resourcesBaseUrl').value = document.getElementById('resourcesBaseUrl').value.replace('http://', 'https://');
        this.updateConfig();
        this.showToast('URLs switched to HTTPS/WSS protocols', 'info');
    }

    resetToDefaults() {
        const defaults = this.getSmartDefaultUrls();
        document.getElementById('baseUrlApi').value = defaults.api;
        document.getElementById('baseUrlWs').value = defaults.ws;
        document.getElementById('resourcesBaseUrl').value = defaults.resources;
        this.updateConfig();
        this.showToast('URLs reset to environment defaults', 'info');
    }

    // Update control buttons state
    updateControlButtons(enabled) {
        const buttons = ['toggleTheme', 'showTickets', 'showChat'];
        buttons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = !enabled;
            }
        });

        // Update initialize button text
        const initButton = document.getElementById('initializeWidget');
        if (initButton) {
            initButton.innerHTML = enabled ? 
                '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Reload Widget</span>' :
                '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path></svg>Initialize Widget</span>';
        }
    }

    // Update status display
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

        // Auto hide after 10 seconds
        setTimeout(() => {
            statusDisplay.classList.add('hidden');
        }, 10000);
    }

    // Update configuration display
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

    // Update debug information
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
                    currentTheme: this.currentTheme
                },
                globalConfig: window.WIDGET_CONFIG,
                resourceUrls: {
                    css: `cappuccino-chat-embedded.css`,
                    js: `cappuccino-chat-embedded.umd.js`
                },
                widgetMethods: this.widget ? Object.getOwnPropertyNames(this.widget).filter(prop => typeof this.widget[prop] === 'function') : []
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

    // Show loading overlay
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    // Show toast notification
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

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);
    }
}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Demo] DOM loaded, initializing demo...');
    window.cappuccinoChatDemo = new CappuccinoChatDemo();
    
    // Make demo available globally for debugging
    if (window.cappuccinoChatDemo.environment.isDevelopment) {
        window.debugDemo = () => {
            console.log('=== DEMO DEBUG ===');
            console.log('Demo instance:', window.cappuccinoChatDemo);
            console.log('Environment:', window.cappuccinoChatDemo.environment);
            console.log('Configuration:', window.cappuccinoChatDemo.config);
            console.log('Widget instance:', window.cappuccinoChatDemo.widget);
            console.log('Global WIDGET_CONFIG:', window.WIDGET_CONFIG);
            console.log('==================');
        };
        
        console.log('[Demo] Development mode - debug function available: window.debugDemo()');
    }
});
