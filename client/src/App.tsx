import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Schedule from "./pages/Schedule";
import Overview from "./pages/Overview";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import Blog from "./pages/Blog";
import Greeting from "./pages/Greeting";
import MemberAdmin from "./pages/MemberAdmin";
import OfficerAdmin from "./pages/OfficerAdmin";
import Officers from "./pages/Officers";
import SeminarAdmin from "./pages/SeminarAdmin";
import SeminarArchive from "./pages/SeminarArchive";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogDetail from "./pages/BlogDetail";
import JoinUs from "./pages/JoinUs";
import ContactManagement from "./pages/admin/ContactManagement";
import Dashboard from "./pages/admin/Dashboard";
import Event30thAnniversary from "./pages/Event30thAnniversary";
import Event30thAnniversaryRsvp from "./pages/Event30thAnniversaryRsvp";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/about" component={About} />
      <Route path="/about/greeting" component={Greeting} />
      <Route path="/about/officers" component={Officers} />
      <Route path="/overview/officers" component={Officers} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/members" component={MemberAdmin} />
      <Route path="/admin/officers" component={OfficerAdmin} />
      <Route path="/admin/seminars" component={SeminarAdmin} />
      <Route path="/admin/blog" component={BlogManagement} />
      <Route path="/admin/contacts" component={ContactManagement} />
      <Route path="/seminars/archive" component={SeminarArchive} />
      <Route path={"/schedule"} component={Schedule} />
      <Route path={"/overview"} component={Overview} />
      <Route path={"/members"} component={Members} />
      <Route path="/members/:id" component={MemberDetail} />
      <Route path={"/blog"} component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/joinus"} component={JoinUs} />
      <Route path="/events/30th-anniversary" component={Event30thAnniversary} />
      <Route path="/events/30th-anniversary/rsvp" component={Event30thAnniversaryRsvp} />
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
