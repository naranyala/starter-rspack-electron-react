import type React from 'react';
import { Component } from 'react';
import clsx from 'clsx';
import LeftSidebar from './renderer/components/LeftSidebar';
import {
  createElectronArchitectureWindow,
  createElectronDevelopmentWindow,
  createElectronIntroWindow,
  createElectronNativeApisWindow,
  createElectronPackagingWindow,
  createElectronPerformanceWindow,
  createElectronSecurityWindow,
  createElectronVersionsWindow,
} from './renderer/features';
import { menuData } from './shared/menu-data';
import {
  appContainer,
  card,
  cardArrow,
  cardContent,
  cardTag,
  cardTitle,
  cardWithArrow,
  cardsList,
  footer,
  header,
  headerContent,
  headerSubtitle,
  headerTitle,
  mainArea,
  mainContent,
  noResults,
  searchContainer,
  searchInput,
  sidebarToggle,
  tabButton,
  tabFilter,
} from './renderer/styles/goober';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'framework', label: 'Framework' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'security', label: 'Security' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'api', label: 'APIs' },
  { id: 'performance', label: 'Performance' },
  { id: 'development', label: 'Dev' },
  { id: 'maintenance', label: 'Maintenance' },
];

class App extends Component {
  state = {
    searchTerm: '',
    activeTab: 'all',
    sidebarOpen: true,
  };

  windowCreators: { [key: string]: any } = {
    'What is Electron?': createElectronIntroWindow,
    'Electron Architecture': createElectronArchitectureWindow,
    'Electron Security Best Practices': createElectronSecurityWindow,
    'Packaging and Distribution': createElectronPackagingWindow,
    'Native Operating System APIs': createElectronNativeApisWindow,
    'Performance Optimization': createElectronPerformanceWindow,
    'Development Workflow': createElectronDevelopmentWindow,
    'Version Management': createElectronVersionsWindow,
  };

  handleCardClick = async (card: any) => {
    const creator = this.windowCreators[card.title] || createElectronIntroWindow;
    try {
      await creator({ title: card.title, content: card.content });
    } catch (error) {
      console.error('Error creating window:', error);
    }
  };

  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleTab = (tabId: string) => {
    this.setState({ activeTab: tabId });
  };

  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  getFilteredCards = () => {
    const { searchTerm, activeTab } = this.state;
    const term = searchTerm.toLowerCase().trim();

    return menuData.filter((card) => {
      const matchesSearch =
        !term ||
        card.title.toLowerCase().includes(term) ||
        card.category.toLowerCase().includes(term);
      const matchesTab = activeTab === 'all' || card.category === activeTab;
      return matchesSearch && matchesTab;
    });
  };

  render() {
    const filteredCards = this.getFilteredCards();

    return (
      <div
        className={clsx(appContainer, 'App', {
          'sidebar-open': this.state.sidebarOpen,
          'sidebar-closed': !this.state.sidebarOpen,
        })}
      >
        <LeftSidebar isOpen={this.state.sidebarOpen} />

        <div className={mainContent(this.state.sidebarOpen)}>
          <header className={header}>
            <button className={sidebarToggle} onClick={this.toggleSidebar}>
              {this.state.sidebarOpen ? '◀' : '▶'}
            </button>
            <div className={headerContent}>
              <h1 className={headerTitle}>Electron Starter</h1>
              <p className={headerSubtitle}>Rspack + React + Electron</p>
            </div>
          </header>

          <main className={mainArea}>
            <div className={searchContainer}>
              <input
                type="text"
                className={searchInput}
                placeholder="Search features..."
                value={this.state.searchTerm}
                onChange={this.handleSearch}
                aria-label="Search features"
              />
            </div>

            <nav className={tabFilter} role="tablist" aria-label="Feature categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={tabButton(this.state.activeTab === cat.id)}
                  onClick={() => this.handleTab(cat.id)}
                  role="tab"
                  aria-selected={this.state.activeTab === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            <div className={cardsList} role="list">
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className={clsx(card, cardWithArrow)}
                    onClick={() => this.handleCardClick(card)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && this.handleCardClick(card)}
                  >
                    <div className={cardContent}>
                      <div className={cardTitle}>{card.title}</div>
                      <span className={cardTag}>{card.category}</span>
                    </div>
                    <span className={cardArrow}>→</span>
                  </div>
                ))
              ) : (
                <div className={noResults}>No results found</div>
              )}
            </div>
          </main>

          <footer className={footer}>
            <p>
              Edit <code>src/App.tsx</code> to customize
            </p>
          </footer>
        </div>
      </div>
    );
  }
}

export default App;
