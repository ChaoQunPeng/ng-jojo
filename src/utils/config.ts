import { classify } from "@angular-devkit/core/src/utils/strings";

export const Biz = {
    RoutingModuleChildrenPath: `src/app/biz/biz-children.ts`,
    RoutingModuleChildrenVarName: `BizModuleChildren`,
    PagePath: `src/app/biz/page`,
    SharedModulePath: `src/app/biz/shared/biz.shared.module.ts`,
    SharedComponentDir: `src/app/biz/shared/components`,
    SharedComponentDirTsConfig: `@bizComponents`,
    RestfulPath: `src/app/biz/restful`,
    ListPath: `src/app/biz/page/`,
    NewPath: `src/app/biz/shared/components/`,
    EditPath: `src/app/biz/shared/components/`,
}

export const Routes = {
    RoutingModuleChildrenPath: `src/app/routes/routes.children.ts`,
    RoutingModuleChildrenVarName: `LayoutChildren`,
    PagePath: `src/app/routes`,
    SharedModulePath: `src/app/shared/shared.module.ts`,
    SharedComponentDir: `src/app/shared/components`,
    SharedComponentDirTsConfig: `@shared/components`,
    RestfulPath: `src/app/restful`,
    ListPath: `src/app/routes/`,
    NewPath: `src/app/shared/components/`,
    EditPath: `src/app/shared/components/`
}

// export const Config = {
//     biz: {
//         filePath: `src/app/biz/biz-children.ts`,
//         variableName: `BizModuleChildren`,
//         text: ``,
//         basePath: `src/app/biz/page`
//     },
//     routes: {
//         filePath: `src/app/routes/routes.children.ts`,
//         variableName: `LayoutChildren`,
//         text: ``,
//         basePath: ``
//     }
// }

export const bizConfig: BaseCfgInterface = {
    filePath: `src/app/biz/biz-children.ts`,
    variableName: `BizModuleChildren`,
    text: ``,
    basePath: `src/app/biz/page`,
    childrenPath: (module: string) => {
        return bizConfig.text = `{ path: '${module}', loadChildren: () => import('./page/${module}/${module}.module').then(m => m.${classify(module)}Module) }`;
    },
    modulePath: `src/app/biz/biz.module.ts`
}

export const routeConfig: BaseCfgInterface = {
    filePath: `src/app/routes/routes.children.ts`,
    variableName: `LayoutChildren`,
    text: ``,
    basePath: `src/app/routes`,
    childrenPath: (module: string) => {
        return routeConfig.text = `{ path: '${module}', loadChildren: () => import('./${module}/${module}.module').then(m => m.${classify(module)}Module) }`;
    },
    modulePath: `src/app/routes/routes.module.ts`
}

export interface BaseCfgInterface {
    filePath: string;
    variableName: string;
    text: string;
    basePath: string;
    childrenPath: Function;
    modulePath: string;
}

export const CONFIG = {
    routes: {

    } as BaseCfgInterface,
    biz: {

    } as BaseCfgInterface
}