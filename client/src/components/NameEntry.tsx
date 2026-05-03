import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface NameEntryProps {
  onStart: (firstName: string, lastName: string) => void;
  onCancel: () => void;
}

export function NameEntry({ onStart, onCancel }: NameEntryProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }

    onStart(firstName.trim(), lastName.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 px-4">
      <Card className="p-8 shadow-lg border-0 w-full max-w-md bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          Welcome to the Quiz
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Please enter your name to begin
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <Input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="text-lg p-3"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <Input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="text-lg p-3"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1 bg-[#d62300] hover:bg-[#c41e00] text-white px-6 py-2 font-bold"
          >
            Start Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
}
