import React, { Component } from 'react';

interface DemoPreviewProps {
  category: string;
  title: string;
}

interface DemoPreviewState {
  isHovered: boolean;
}

class ElectronDemoPreview extends Component<DemoPreviewProps, DemoPreviewState> {
  constructor(props: DemoPreviewProps) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { category, title } = this.props;
    
    // Generate demo content based on category
    const getDemoContent = () => {
      switch(category) {
        case 'framework':
          return (
            <div className="demo-framework">
              <div className="demo-item">✅ Cross-platform compatibility</div>
              <div className="demo-item">🌐 Web technologies (HTML/CSS/JS)</div>
              <div className="demo-item">📦 Bundled Chromium + Node.js</div>
              <div className="demo-item">📱 Popular apps: VS Code, Discord, Slack</div>
            </div>
          );
        case 'architecture':
          return (
            <div className="demo-architecture">
              <div className="process main-process">
                <div className="process-name">Main Process</div>
                <div className="process-desc">Controls app lifecycle</div>
              </div>
              <div className="ipc-connection">↔ IPC ↔</div>
              <div className="process renderer-process">
                <div className="process-name">Renderer Process</div>
                <div className="process-desc">UI rendering</div>
              </div>
            </div>
          );
        case 'security':
          return (
            <div className="demo-security">
              <div className="security-feature">🔒 Context Isolation</div>
              <div className="security-feature">🛡️ CSP (Content Security Policy)</div>
              <div className="security-feature">🔑 Input Validation</div>
              <div className="security-feature">🔐 Sanitized Operations</div>
            </div>
          );
        case 'packaging':
          return (
            <div className="demo-packaging">
              <div className="platform-badge windows">Windows</div>
              <div className="platform-badge macos">macOS</div>
              <div className="platform-badge linux">Linux</div>
              <div className="packager">📦 electron-builder</div>
            </div>
          );
        case 'api':
          return (
            <div className="demo-api">
              <div className="api-item">📁 File System Access</div>
              <div className="api-item">🔔 Notifications</div>
              <div className="api-item">📋 Clipboard</div>
              <div className="api-item">🖼️ Tray Icons</div>
            </div>
          );
        case 'performance':
          return (
            <div className="demo-performance">
              <div className="perf-metric">⏱️ Startup Time: 1.2s</div>
              <div className="perf-metric">💾 Memory: 85MB</div>
              <div className="perf-metric">⚡ Responsiveness: 98%</div>
              <div className="perf-metric">📊 Optimized Bundle</div>
            </div>
          );
        case 'development':
          return (
            <div className="demo-development">
              <div className="dev-tool">🔄 HMR (Hot Module Replacement)</div>
              <div className="dev-tool">🔍 DevTools Integration</div>
              <div className="dev-tool">🐛 Debugging Support</div>
              <div className="dev-tool">🧪 Testing Framework</div>
            </div>
          );
        case 'maintenance':
          return (
            <div className="demo-maintenance">
              <div className="maint-item">🔄 Auto Updates</div>
              <div className="maint-item">🔒 Security Patches</div>
              <div className="maint-item">📈 Version Tracking</div>
              <div className="maint-item">📝 Release Notes</div>
            </div>
          );
        default:
          return (
            <div className="demo-default">
              <div className="demo-item">💻 Electron Integration</div>
              <div className="demo-item">🔧 API Access</div>
              <div className="demo-item">🚀 Performance</div>
              <div className="demo-item">🔒 Security</div>
            </div>
          );
      }
    };

    return (
      <div 
        className={`demo-preview-container ${this.state.isHovered ? 'hovered' : ''}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="demo-header">
          <span className="demo-icon">▶️</span>
          <span className="demo-title">Demo: {title}</span>
        </div>
        <div className="demo-content">
          {getDemoContent()}
        </div>
        <div className="demo-actions">
          <button className="demo-btn">Run Demo</button>
          <button className="demo-btn secondary">View Code</button>
        </div>
      </div>
    );
  }
}

export default ElectronDemoPreview;