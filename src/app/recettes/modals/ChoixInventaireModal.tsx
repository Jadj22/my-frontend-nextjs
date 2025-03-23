"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

interface ChoixInventaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (inventaireId: number) => void;
}

export default function ChoixInventaireModal({ isOpen, onClose, onSelect }: ChoixInventaireModalProps) {
  const [inventaires, setInventaires] = useState([{ id: 1, nom: "Inventaire 1" }, { id: 2, nom: "Inventaire 2" }]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Choisir un inventaire</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <ul>
          {inventaires.map((inv) => (
            <li key={inv.id} className="mb-2">
              <button
                onClick={() => onSelect(inv.id)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                {inv.nom}
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-4 flex items-center bg-green-500 text-white p-2 rounded hover:bg-green-600">
          <Plus className="mr-1" size={16} /> Ajouter un inventaire
        </button>
      </div>
    </div>
  );
}