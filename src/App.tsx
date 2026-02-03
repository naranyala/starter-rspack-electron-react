import clsx from 'clsx';
import type React from 'react';
import { Component } from 'react';
import LeftSidebar from './frontend/components/LeftSidebar';
import {
  AppContainer,
  MainContent,
  Header,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle,
  MainArea,
  SearchContainer,
  SearchInput,
  TabFilter,
  TabButton,
  CardsList,
  Card,
  CardContent,
  CardTitle,
  CardTag,
  CardArrow,
  NoResults,
  Footer,
  SidebarToggle,
  SidebarBackdrop,
} from './frontend/styles/redesigned-styles';
import {
  createElectronArchitectureWindow,
  createElectronDevelopmentWindow,
  createElectronIntroWindow,
  createElectronNativeApisWindow,
  createElectronPackagingWindow,
  createElectronPerformanceWindow,
  createElectronSecurityWindow,
  createElectronVersionsWindow,
} from './frontend/use-cases';
import { menuData } from './shared/menu-data';

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
      <AppContainer
        className={clsx('App', {
          'sidebar-open': this.state.sidebarOpen,
          'sidebar-closed': !this.state.sidebarOpen,
        })}
      >
        <LeftSidebar isOpen={this.state.sidebarOpen} />

        {/* Mobile sidebar backdrop */}
        <SidebarBackdrop
          isOpen={this.state.sidebarOpen}
          onClick={this.toggleSidebar}
        />

        <MainContent isSidebarOpen={this.state.sidebarOpen}>
          <Header>
            <SidebarToggle onClick={this.toggleSidebar}>
              {this.state.sidebarOpen ? '◀' : '▶'}
            </SidebarToggle>
            <HeaderContent>
              <HeaderTitle>Electron Starter</HeaderTitle>
              <HeaderSubtitle>Rspack + React + Electron</HeaderSubtitle>
            </HeaderContent>
          </Header>

          <MainArea>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search features..."
                value={this.state.searchTerm}
                onChange={this.handleSearch}
                aria-label="Search features"
              />
            </SearchContainer>

            <TabFilter role="tablist" aria-label="Feature categories">
              {categories.map((cat) => (
                <TabButton
                  key={cat.id}
                  isActive={this.state.activeTab === cat.id}
                  onClick={() => this.handleTab(cat.id)}
                  role="tab"
                  aria-selected={this.state.activeTab === cat.id}
                >
                  {cat.label}
                </TabButton>
              ))}
            </TabFilter>

            <CardsList role="list">
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <Card
                    key={card.id}
                    onClick={() => this.handleCardClick(card)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && this.handleCardClick(card)}
                  >
                    <CardContent>
                      <CardTitle>{card.title}</CardTitle>
                      <CardTag>{card.category}</CardTag>
                    </CardContent>
                    <CardArrow className="card-arrow">→</CardArrow>
                  </Card>
                ))
              ) : (
                <NoResults>No results found</NoResults>
              )}
            </CardsList>
          </MainArea>

          <Footer>
            <p>
              Edit <code>src/App.tsx</code> to customize
            </p>
          </Footer>
        </MainContent>
      </AppContainer>
    );
  }
}

export default App;
