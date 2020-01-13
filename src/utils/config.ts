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

export interface BaseSchmeOptions {
    name: string;
    module: string;
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
    biz: {
        dirPath: `src/app/biz`,
        routesModulePath: `src/app/biz/biz-routes.ts`,
        routesModuleVar: `BizModulesChildren`,
        routesModuleVarText: (options: any) => {
            return `{ path: '${options.module}', loadChildren: () => import('./${options.module}/${options.module}.module').then(m => m.${classify(options.module)}Module) }`
        },
        mainModulePath: `src/app/biz/biz.module.ts`,
        mainModuleVal: `MODULES`,
        mainModuleValText: (options: any) => {
            return classify(`${options.module}Module`);
        }
    } as CfgInterface,

    routes: {
        dirPath: `src/app/routes`,
        routesModulePath: `src/app/routes/routes.children.ts`,
        routesModuleVar: `RoutesModuleChildren`,
        routesModuleVarText: (options: any) => {
            return `{ path: '${options.module}', loadChildren: () => import('./${options.module}/${options.module}.module').then(m => m.${classify(options.module)}Module) }`
        },
        mainModulePath: `src/app/routes/routes.module.ts`,
        mainModuleVal: `FRAMEWORK_MODULE`,
        mainModuleValText: (options: any) => {
            return classify(`${options.module}Module`);
        }
    } as CfgInterface
}

export interface CfgInterface {
    /**
     * 业务模块和框架模块的基础路径
     */
    dirPath: string;
    /**
     * 路由模块对象数组
     */
    routesModulePath: string;
    /**
     * 路由模块对象数组的变量名
     */
    routesModuleVar: string;
    /**
     * 要插入到路由模块对象数组的变量里的文本
     */
    routesModuleVarText: (option: any) => string;
    /**
     * 主模块路径
     */
    mainModulePath: string;
    /**
     * 主模块中需要进行操作的变量的名字
     */
    mainModuleVal: string;
    /**
     * 主模块中插入需要操作变量的文本，此处一般是模块的类名
     */
    mainModuleValText: (option: any) => string;
}