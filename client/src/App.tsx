import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Handyman from "./pages/Handyman";
import Cleaning from "./pages/Cleaning";
import TVMounting from "./pages/TVMounting";
import FurnitureAssembly from "./pages/FurnitureAssembly";
import LawnCare from "./pages/LawnCare";
import MovingHelp from "./pages/MovingHelp";
import JunkRemoval from "./pages/JunkRemoval";
import PressureWashing from "./pages/PressureWashing";
import GoodJoeBranding from "./components/GoodJoeBranding";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/services/handyman"} component={Handyman} />
      <Route path={"/services/cleaning"} component={Cleaning} />
      <Route path={"/services/tv-mounting"} component={TVMounting} />
      <Route path={"/services/furniture-assembly"} component={FurnitureAssembly} />
      <Route path={"/services/lawn-care"} component={LawnCare} />
      <Route path={"/services/moving-help"} component={MovingHelp} />
      <Route path={"/services/junk-removal"} component={JunkRemoval} />
      <Route path={"/services/pressure-washing"} component={PressureWashing} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <GoodJoeBranding />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
