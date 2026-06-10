import { Component, type ReactNode } from 'react';

type ErrorBoundaryFallbackProps = {
  error: Error;
  reset: () => void;
};

type ErrorBoundaryFallback =
  | ReactNode
  | ((props: ErrorBoundaryFallbackProps) => ReactNode);

type ErrorBoundaryProps = {
  fallback: ErrorBoundaryFallback;
  onReset?: () => void;
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * 하위 트리에서 던져진 렌더링 에러를 잡아 fallback을 노출하는 에러 경계.
 * fallback에 reset을 제공하며, onReset(예: react-query reset)과 함께 재시도를 지원한다.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  private reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error !== null) {
      return typeof fallback === 'function'
        ? fallback({ error, reset: this.reset })
        : fallback;
    }

    return children;
  }
}
