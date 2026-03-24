import useColorTheme from "@/hooks/use-color-theme";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ActivityIndicator, View, Text, Modal } from "react-native";

interface LoadingContextType {
	isLoading: boolean;
	setLoading: (state: boolean) => void;
}
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
	const [isLoading, setLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ isLoading, setLoading }}>
			{children}
			{isLoading && <LoadingScreen />}
		</LoadingContext.Provider>
	);
}
export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (context === undefined) {
		throw new Error("useLoading must be used within a LoadingProvider");
	}

	return context;
};

const LoadingScreen = () => {
	const theme = useColorTheme();
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={true}
			onRequestClose={undefined}
		>
			<View className="flex-1 justify-center items-center bg-black/50">
				{/* Container for the indicator and text */}
				<View className="p-6 bg-background rounded-2xl shadow-lg items-center">
					<ActivityIndicator size="large" color={theme.onBackground} />
				</View>
			</View>
		</Modal>
	);
};
