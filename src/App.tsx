import React, { Component } from 'react';
import './App.css';
import 'winbox/dist/css/winbox.min.css';
import WinBox from 'winbox/src/js/winbox';
import { menuData } from './renderer/menu-data';
import {
  createElectronIntroWindow,
  createElectronArchitectureWindow,
  createElectronSecurityWindow,
  createElectronPackagingWindow,
  createElectronNativeApisWindow,
  createElectronPerformanceWindow,
  createElectronDevelopmentWindow,
  createElectronVersionsWindow
} from './renderer/use-cases';

// Define TypeScript interfaces
interface MenuItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface FuzzySearchResult {
  matches: boolean;
  highlightedText: string;
}

interface CardProps {
  title: string;
  content: string;
  index: number;
  searchTerm: string;
}

interface AppState {
  searchTerm: string;
}

// Simple fuzzy search function
const fuzzySearch = (text: string, query: string): FuzzySearchResult => {
  if (!query) return { matches: true, highlightedText: text };

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let matchFound = true;
  let highlightedText = '';
  let queryIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();

    if (queryIndex < lowerQuery.length && lowerChar === lowerQuery[queryIndex]) {
      highlightedText += `<mark>${char}</mark>`;
      queryIndex++;
    } else {
      highlightedText += char;
    }
  }

  // Check if all query characters were found in sequence
  matchFound = queryIndex === lowerQuery.length;

  return { matches: matchFound, highlightedText };
};

// Card component (with only title)
class Card extends Component<CardProps> {
  handleCardClick = () => {
    const { title, content, index } = this.props;

    // Map titles to specific window creators
    const windowCreators: { [key: string]: (options: { title: string; content?: string }) => WinBox } = {
      'What is Electron?': createElectronIntroWindow,
      'Electron Architecture': createElectronArchitectureWindow,
      'Electron Security Best Practices': createElectronSecurityWindow,
      'Packaging and Distribution': createElectronPackagingWindow,
      'Native Operating System APIs': createElectronNativeApisWindow,
      'Performance Optimization': createElectronPerformanceWindow,
      'Development Workflow': createElectronDevelopmentWindow,
      'Version Management': createElectronVersionsWindow,
    };

    // Use the specific window creator if available, otherwise use a default
    const windowCreator = windowCreators[title] || createElectronIntroWindow;

    // Create the specific window based on the title
    windowCreator({ title, content });
  };

  render() {
    const { title, searchTerm } = this.props;

    // Process title for highlighting
    const processedTitle = fuzzySearch(title, searchTerm);

    return (
      <div className="simple-card" onClick={this.handleCardClick}>
        <h3
          className="simple-card-title"
          dangerouslySetInnerHTML={{ __html: processedTitle.matches ? processedTitle.highlightedText : title }}
        />
      </div>
    );
  }
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      searchTerm: ''
    };
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    // Filter cards based on search term
    const filteredCards = menuData.filter((card: MenuItem, index: number) => {
      const titleMatch = fuzzySearch(card.title, this.state.searchTerm).matches;
      return titleMatch;
    });

    return (
      <div className="App">
        <main className="App-main-no-navbar">
          <div className="search-container-no-navbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search topics..."
              value={this.state.searchTerm}
              onChange={this.handleSearchChange}
            />
            <div className="cards-list">
              {filteredCards.length > 0 ? (
                filteredCards.map((card: MenuItem, index: number) => (
                  <Card
                    key={card.id || index}
                    index={index}
                    title={card.title}
                    content={card.content}
                    searchTerm={this.state.searchTerm}
                  />
                ))
              ) : (
                <div className="no-results">No matching topics found</div>
              )}
            </div>
          </div>
        </main>
        <footer className="App-footer">
          <p>Get started by editing <code>src/App.tsx</code> and save to reload.</p>
        </footer>
      </div>
    );
  }
}

export default App;