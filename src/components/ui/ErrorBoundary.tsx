import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-charcoal text-ivory flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="font-display text-4xl mb-4 text-turmeric">Something went wrong</h1>
          <p className="font-sans text-ivory/70 max-w-md mx-auto mb-8">
            We're sorry, but an unexpected error occurred. Please try refreshing the page or going back to the home page.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
            <a href="/" className="btn-outline">
              Go Home
            </a>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-12 text-left bg-black/50 p-4 rounded-xl border border-rose/20 text-rose/80 overflow-auto max-w-3xl text-xs font-mono">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
