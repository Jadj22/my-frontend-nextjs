export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR");
  };
  
  export const formatQuantity = (quantity: number, unit: string): string => {
    return `${quantity} ${unit}`;
  };