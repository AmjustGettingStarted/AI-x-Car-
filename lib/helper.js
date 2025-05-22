// Helper function to serialize car Data
export const serializeCarData = (car, wishListed = false) => {
  return {
    ...car,
    price: car.price ? parseFloat(car.price.toString()) : 0,
    createdAt: car.createdAt?.toISOString(),
    updatedAt: car.updatedAt?.toISOString(),
    wishListed:wishListed,
  };
};
