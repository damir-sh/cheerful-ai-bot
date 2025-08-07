"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface ToastMessage {
	id: string;
	message: string;
	severity: AlertColor;
	duration?: number;
}

interface ToastContextType {
	showToast: (
		message: string,
		severity?: AlertColor,
		duration?: number
	) => void;
	showError: (message: string) => void;
	showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/*
	Hook to show toast messages
*/

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

interface ToastProviderProps {
	children: ReactNode;
}

/*
	Provider for toast messages
*/

export function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = (
		message: string,
		severity: AlertColor = "info",
		duration: number = 6000
	) => {
		const id = Math.random().toString(36).substring(7);
		const newToast: ToastMessage = { id, message, severity, duration };

		setToasts((prev) => [...prev, newToast]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, duration);
	};

	const showError = (message: string) => showToast(message, "error");
	const showSuccess = (message: string) => showToast(message, "success");

	const handleClose = (toastId: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
	};

	return (
		<ToastContext.Provider value={{ showToast, showError, showSuccess }}>
			{children}
			{toasts.map((toast) => (
				<Snackbar
					key={toast.id}
					open={true}
					autoHideDuration={toast.duration}
					onClose={() => handleClose(toast.id)}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				>
					<Alert
						onClose={() => handleClose(toast.id)}
						severity={toast.severity}
						variant="filled"
						sx={{ width: "100%" }}
					>
						{toast.message}
					</Alert>
				</Snackbar>
			))}
		</ToastContext.Provider>
	);
}
