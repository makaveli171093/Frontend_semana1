import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  haFallado: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    haFallado: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { haFallado: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error aislado en una sección:", error, info);
  }

  render() {
    if (this.state.haFallado) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
