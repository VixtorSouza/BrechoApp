import "react";

declare module "react" {
  // Adiciona tipos para os hooks que estão faltando
  function useState<T>(
    initialState: T | (() => T)
  ): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(
    effect: () => void | (() => void),
    deps?: ReadonlyArray<any>
  ): void;
  function useContext<T>(context: React.Context<T>): T;
}

declare global {
  // Adiciona tipos para o React Native
  namespace React {
    interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement<any, any> | null;
      propTypes?: any;
      contextTypes?: any;
      defaultProps?: Partial<P>;
      displayName?: string;
    }
  }
}
