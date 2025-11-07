// src/vue-router.d.ts
declare module 'vue-router' {
    import type { DefineComponent } from 'vue'

    export interface RouteMeta {
        // 可以在这里定义路由元数据字段
        title?: string
        requiresAuth?: boolean
    }

    export interface RouteRecordRaw {
        path: string
        name?: string
        component?: any
        children?: RouteRecordRaw[]
        meta?: RouteMeta
    }

    export function createRouter(options: any): any
    export function createWebHashHistory(base?: string): any
    export function createWebHistory(base?: string): any
}
