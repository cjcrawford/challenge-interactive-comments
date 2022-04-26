export const mockApiCall = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};
