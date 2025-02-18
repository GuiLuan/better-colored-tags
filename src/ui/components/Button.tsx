import React from "react";

export default function Button({ icon, onClick }: ButtonProps) {
	return (
		<button style={styles.button} onClick={onClick}>
			{icon}
		</button>
	);
}

interface ButtonProps {
	icon: React.JSX.Element;
	onClick: () => void;
}

const styles: Record<string, React.CSSProperties> = {
	button: {
		display: "flex",
		alignItems: "center",
		justifyItems: "center",
		borderRadius: "5px",
		cursor: "pointer",
	},
};
