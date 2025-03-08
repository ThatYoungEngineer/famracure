import React, { useState } from "react";

const MedicationsInput = ({ value, onChange }) => {
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");

  // Initialize medications if value is provided
  React.useEffect(() => {
    if (value && Array.isArray(value)) {
      setMedications(value);
    }
  }, [value]);

  // Add a new medication
  const handleAddMedication = () => {
    if (name && dosage) {
      const newMedications = [...medications, { name, dosage }];
      setMedications(newMedications);
      setName("");
      setDosage("");
      // Pass the updated array to the parent component
      onChange(newMedications);
    }
  };

  // Remove a medication
  const handleRemoveMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
    // Pass the updated array to the parent component
    onChange(newMedications);
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Display existing medications */}
        {medications.map((medication, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="font-medium">{medication.name}:</span>
            <span>{medication.dosage}</span>
            <button
              type="button"
              onClick={() => handleRemoveMedication(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Input for new medication */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Medication Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleAddMedication}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Medication
        </button>
      </div>
    </div>
  );
};

export default MedicationsInput;