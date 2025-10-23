import AppThemeProvider from "./providers/ThemeProvider.tsx";
import Router from "./router/Router.tsx";

function App() {
  return (
    <AppThemeProvider>
      <Router />
    </AppThemeProvider>
  );
}

export default App;
