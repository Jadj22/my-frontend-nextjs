"use client";
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Label from "./Label"; // Importation locale du nouveau composant Label

interface Option {
  value: string;
  label: string;
}

interface SelectComponentProps {
  label?: string; // Étiquette optionnelle au-dessus du sélecteur
  options: Option[]; // Liste des options (ex. recettes, ingrédients, unités)
  value?: string; // Valeur sélectionnée
  onChange: (value: string) => void; // Callback pour changement de valeur
  placeholder?: string; // Placeholder du sélecteur
  className?: string; // Classe CSS supplémentaire pour le conteneur
  disabled?: boolean; // Désactiver le sélecteur
  required?: boolean; // Indique si le champ est requis
}

export default function SelectComponent({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner une option",
  className = "",
  disabled = false,
  required = false,
}: SelectComponentProps) {
  const selectId = `select-${label?.replace(/\s+/g, "-").toLowerCase() || "default"}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}
      <BaseSelect value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={selectId} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </BaseSelect>
    </div>
  );
}