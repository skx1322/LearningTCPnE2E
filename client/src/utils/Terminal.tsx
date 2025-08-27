// import type { Line } from "../types/types";

// interface handleKey {
//   setLines: React.Dispatch<React.SetStateAction<Line[]>>;
//   setInput: React.Dispatch<React.SetStateAction<string>>;
//   input: string;
// }

// export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, {input, setLines, setInput}: handleKey) => {
//   if (e.key === "Enter") {
//     const command = input.trim();
//     setLines((prevLines) => [
//       ...prevLines,
//       { text: `> ${command}`, isInput: true },
//     ]);
//     processCommand(command, setLines);
//     setInput("");
//   }
// };

// export const processCommand = (command: string, {setLines}: handleKey) => {
//   let output: string;
//   if (command.toLowerCase() === "help") {
//     output = "Available commands: help, clear. Try typing 'help' or 'clear'.";
//   } else if (command.toLowerCase() === "clear") {
//     setLines([]);
//     return;
//   } else {
//     output = `Command not found: ${command}`;
//   }
//   setLines((prevLines) => [...prevLines, { text: output, isInput: false }]);
// };
