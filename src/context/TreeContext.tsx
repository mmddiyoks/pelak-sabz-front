"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect, Suspense } from 'react';

export interface BaseTreeType {
    id: number;
    typeName: string;
}

export interface BaseTreeLeafType {
    id: number;
    leafType: string;
}

export interface BaseTreeIrrigation {
    id: number;
    irrigationName: string;
}

export interface BaseRegions {
    id: number;
    regionName: string;
}

export interface BaseStreet {
    id: number;
    streetName: string;
}

export interface BaseTreeStatus {
    id: number;
    statusName: string;
}

export interface TreeObject {
    id: number;
    baseTreeType: BaseTreeType;
    baseTreeLeafType: BaseTreeLeafType;
    baseTreeIrrigation: BaseTreeIrrigation;
    baseRegions: BaseRegions;
    baseStreet: BaseStreet;
    baseTreeStatus: BaseTreeStatus;
    objectID: number;
    name: string;
    health: number;
    harvestDate: string | null;
    plantingDate: string;
    age: string;
    ageGrade: string;
    code: string;
    x: number;
    y: number;
    hasTag: boolean;
    qr: string | null;
    address: string;
    diameter: number;
    height: number | null;
    description: string | null;
}

interface TreeState {
    tree: TreeObject | null;
    isLoading: boolean;
    error: string | null;
}

type TreeAction =
    | { type: 'SET_TREE'; payload: TreeObject | null }
    | { type: 'UPDATE_TREE'; payload: Partial<TreeObject> }
    | { type: 'CLEAR_TREE' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const initialState: TreeState = {
    tree: null,
    isLoading: false,
    error: null,
};

const treeReducer = (state: TreeState, action: TreeAction): TreeState => {
    switch (action.type) {
        case 'SET_TREE':
            return {
                ...state,
                tree: action.payload,
            };
        case 'UPDATE_TREE':
            return {
                ...state,
                tree: state.tree ? { ...state.tree, ...action.payload } : null,
            };
        case 'CLEAR_TREE':
            return {
                ...state,
                tree: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

interface TreeContextType extends TreeState {
    // Tree management
    setTree: (tree: TreeObject | null) => void;
    updateTree: (data: Partial<TreeObject>) => void;
    clearTree: () => void;

    // Loading and error handling
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const TreeProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(treeReducer, initialState);

    // Tree management functions
    const setTree = (tree: TreeObject | null) => {
        dispatch({ type: 'SET_TREE', payload: tree });
    };

    const updateTree = (data: Partial<TreeObject>) => {
        dispatch({ type: 'UPDATE_TREE', payload: data });
    };

    const clearTree = () => {
        dispatch({ type: 'CLEAR_TREE' });
    };

    // Loading and error handling
    const setLoading = (loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    return (
        <Suspense fallback={null}>
            <TreeContext.Provider
                value={{
                    ...state,
                    setTree,
                    updateTree,
                    clearTree,
                    setLoading,
                    setError,
                }}
            >
                {children}
            </TreeContext.Provider>
        </Suspense>
    );
};

export const useTree = () => {
    const context = useContext(TreeContext);
    if (context === undefined) {
        throw new Error('useTree must be used within a TreeProvider');
    }
    return context;
};
