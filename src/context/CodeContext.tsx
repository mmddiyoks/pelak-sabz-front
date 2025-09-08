"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect, Suspense } from 'react';
export interface AddressObject {
    plate_id: number | string;
    plate_no: number;
    poi_type: string;
    postalcode: string;
    address_te: string;
    url: string;
    pa_code?: string;
    layer?: null;
    shapeText?: string;
    x: number,
    y: number
    geometry?: {
        flatCoordinates: number[]
    };

}

interface CodeState {
    key: string | undefined;
    info: AddressObject | null;
    isLoading: boolean;
    buildingPlaques: AddressObject[];
}

type CodeAction =
    | { type: 'SET_INFO'; payload: AddressObject }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_BUILDING_PLAQUES'; payload: AddressObject[] };

const initialState: CodeState = {
    key: undefined,
    info: null,
    isLoading: true,
    buildingPlaques: [],
};

const codeReducer = (state: CodeState, action: CodeAction): CodeState => {
    switch (action.type) {
        case 'SET_INFO':
            return {
                ...state,
                info: action.payload,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_BUILDING_PLAQUES':
            return {
                ...state,
                buildingPlaques: action.payload,
            };
        default:
            return state;
    }
};

interface CodeContextType extends CodeState {
    setInfo: (data: AddressObject) => void;
    setIsLoading: (data: boolean) => void;
    setBuildingPlaques: (data: AddressObject[]) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(codeReducer, initialState);

    const setInfo = (data: AddressObject) => {
        dispatch({ type: 'SET_INFO', payload: data });
    };

    const setIsLoading = (data: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: data });
    };

    const setBuildingPlaques = (data: AddressObject[]) => {
        dispatch({ type: 'SET_BUILDING_PLAQUES', payload: data });
    };

    return (
        <Suspense fallback={null}>
            <CodeContext.Provider
                value={{
                    ...state,
                    setInfo,
                    setIsLoading,
                    setBuildingPlaques,
                }}
            >
                {children}

            </CodeContext.Provider>
        </Suspense>

    );
};

export const useCode = () => {
    const context = useContext(CodeContext);
    if (context === undefined) {
        throw new Error('useCode must be used within a CodeProvider');
    }
    return context;
}; 