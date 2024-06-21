import { ElementType, lazy, Suspense } from "react";
import { pageList } from "./constants";

/**
 * This file contains a function `lazyRoute` that creates a lazy-loaded React component.
 * The component is loaded using a dynamic import, which is provided as a `factory` function.
 *
 * The `lazyRoute` function is used in the `mapPagesToModules` function, which maps a list of page names
 * to their corresponding lazy-loaded components. The page names and a list of dynamic import functions
 * are provided as parameters.
 *
 * The `mapPagesToModules` function reduces over the list of page names, and for each page, it finds the
 * corresponding dynamic import function in the `moduleList` by checking if the import function's path
 * includes the page name. If a matching import function is found, a lazy-loaded component is created
 * using the `lazyRoute` function and added to the accumulator object under the page name.
 *
 * The `importPages` constant is created by calling `mapPagesToModules` with `pageList` and `modules`.
 * This constant is an object that maps page names to their corresponding lazy-loaded components.
 *
 * Note: This file assumes that the modules are located in paths like `../pages/Login/Login.tsx` and
 * `../pages/Dashboard/Dashboard.tsx`. Adjust the `modulePath` check in `mapPagesToModules` as needed
 * for your project structure.
 */

const modules = import.meta.glob("../pages/**/*.tsx");

type Props = {
  loading?: ElementType;
  error?: ElementType;
  factory: () => Promise<{
    default: () => JSX.Element;
  }>;
};
type PageKeys = (typeof pageList)[number];
type Pages = Record<PageKeys, JSX.Element>;

export function lazyRoute({ factory }: Props) {
  const Elem = lazy(factory);
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <Elem />
    </Suspense>
  );
}

function mapPagesToModules(
  pages: typeof pageList,
  moduleList: Record<string, () => Promise<unknown>>
) {
  return pages.reduce((acc, page) => {
    const modulePath = Object.keys(modules).find((path) =>
      path.includes(`/${page}/${page}`)
    );
    if (modulePath) {
      acc[page] = lazyRoute({
        factory: moduleList[modulePath] as () => JSX.Element["type"],
      });
    }
    return acc;
  }, {} as Pages);
}

export const importPages = mapPagesToModules(pageList, modules);

// TODO: do not remove this comment, code beyond might be work with bugs

// export const importPages: Pages = {
//   Login: lazyRoute({
//     factory: () => import('@/pages/Login/LoginPage'),
//   }),
//   Dashboard: lazyRoute({
//     factory: () => import('@/pages/Dashboard/DashboardPage'),
//   }),
// };
